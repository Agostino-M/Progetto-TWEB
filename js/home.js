/**
 * This file contains all the function to set up the music streaming view
 * and update it based on the interaction with the user.
 *
 * @author  Agostino Messina
 */

// Global variables
var username;
var is_admin;
var song = new Audio();
var queue = [];
var previous = [];
var lastsong;
var shuffle = false;
var repeat = false;
var repeat_src = " ";

/* Document Section */
// Document Ready
$(document).ready(function () {
    username = $.trim($('.user-widget-name').text());
    is_admin = $('.admin-verified').length;

    fill_side_playlists();
    show_homepage();
    setTimeout(() => {
        $('#page-loading').hide()
    }, 200);
});

//closes the user-settings-widget when the user clicks outside
$(document).click(function (e) {
    if (e.target.className !== "profile-button") {
        $(".user-settings-widget").hide();
        $(".profile-button svg").removeClass("rotate");
    }
    if (e.target.className !== "option-button" && e.target.className !== "row-song") {
        $(".option-button").hide();
        $(".option-button .song-option-widget").hide();
    }
});

/* Listeners */
//the form in the create playlist widget creates a new playlist
$(".create-playlist-widget form").submit(function () {
    check_valid_playlist_name().done(function (data) {
        if (data == "OK") {
            $('#error-playlist-name').hide();
            $('#playlist-name').removeClass("invalid");
            $.get("./requests.php", "username=" + username + "&type=insert_new_pl&pl_name=" + $('#playlist-name').val(), function (data) {
                if (data == "ok") {
                    $('.create-playlist-widget').fadeOut();
                    $('#playlist-name').val("");
                    fill_side_playlists();
                } else {
                    $('#playlist-name').addClass("invalid");
                    $('#error-playlist-name').show();
                }
            });
        } else {
            $('#playlist-name').addClass("invalid");
            $('#error-playlist-name').text("Nome già utilizzato");
            $('#error-playlist-name').show();
        }
    })
});

//svg in the upper right that open the user's settings
$(".profile-button").on("click", function () {
    $(".profile-button .user-widget-svg").toggleClass("rotate");
    $(".user-settings-widget").toggle();
});

//button in the user's setting that log out the user
$("li:first > .transparent-button").click(function () {
    window.location.replace("../php/logout.php")
});

//button in the left navbar playlist that open the create playlist widget
$(".create-playlist-button").click(function () {
    $(".create-playlist-widget").fadeToggle();
});

//button that closes the create playlist widget
$(".create-playlist-close-widget").click(function (e) {
    $(".create-playlist-widget").fadeOut();
});

//open the homepage section
$("#home").click(function () {
    $("#saved-songs").children().removeClass("active-playlist");
    $("#user-playlist").children().children().removeClass("active-playlist");
    show_homepage();
});

//open the library section
$("#library").click(function () {
    $("#saved-songs").children().removeClass("active-playlist");
    $("#user-playlist").children().children().removeClass("active-playlist");
    show_library_top_header();
    show_artists();
});

//open the songs section
$("#saved-songs").click(function () {
    $("#saved-songs").children().addClass("active-playlist");
    $("#home").removeClass("link-section-active");
    $("#library").removeClass("link-section-active");
    $("#user-playlist").children().children().removeClass("active-playlist");

    show_songs();
});

//change the song volume based of the volume slider value
$(".volume-slider").change(function () {
    song.volume = parseFloat(this.value / 100);
});

// music playing functions
$('.playpause-button').click(play_pause);
$('.backwards-button').click(play_previous);
$('.forwards-button').click(play_next);
$('.shuffle-button').click(function () {
    $(this).toggleClass('shuffle-button-active');
    shuffle = !shuffle;
    if (shuffle && queue.length > 1) {
        shuffle_queue(queue);
    }
})

//activate repeat of the song
$('.repeat-button').click(function () {
    $(this).toggleClass('repeat-button-active');
    repeat = !repeat;
    if (repeat) {
        repeat_src = song.src;
    }
})

//plays next song when the one played has finished
song.onended = function () {
    play_next();
};

/* Tools and functions */
/**
 * transform seconds to time format mm:ss
 * @param secs
 * @returns {string}
 */
function secondsToTime(secs) {
    secs = Math.round(secs);
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
}

/**
 * activate the music player
 */
function activate_player() {
    $(".playpause-button").removeAttr('disabled');
    $(".forwards-button").removeAttr('disabled');
    $(".backwards-button").removeAttr('disabled');
}

/**
 * let the #scroll div slide to the specified direction
 * @param direction
 */
function slide(direction) {
    var container = document.getElementById('scroll');
    scrollCompleted = 0;
    var slideVar = setInterval(function () {
        if (direction == 'Indietro') {
            container.scrollLeft -= 100;
        } else {
            container.scrollLeft += 100;
        }
        scrollCompleted += 100;
        if (scrollCompleted >= 500) {
            window.clearInterval(slideVar);
        }
    }, 50);
}


/**
 *  check if the name of the playlist is already used
 * @returns {*}
 */
function check_valid_playlist_name() {
    return $.get("./requests.php", "username=" + username + "&type=check_pl_exist&new_pl_name=" + $('#playlist-name').val());
}

/**
 * function that calls the URL with only a head and returns a boolean based on the success of the call
 * @param url
 * @returns {boolean}
 */
function check_remotely_exist(url) {
    $flag = 0;
    $.ajax({
        async: false, type: "HEAD", url: url, success: function (response) {
            $flag = 1;
        }
    });
    if ($flag == 1) {
        return true;
    } else {
        return false;
    }
}

/* Show functions */
/**
 * fill all user playlists in the left navbar
 */
function fill_side_playlists() {
    $wrapper = $('#user-playlist').empty();
    $.getJSON("./requests.php", "type=user_playlists&username=" + username, function (json) {
        json.playlists.forEach(function (item) {
            $('<div>', {
                'id': item.name.replace(/\s/g, ''),
                'class': 'saved-songs-link navbar-playlist-item',
                'prepend': $('<div>', {
                    'class': 'saved-songs-button-border', 'append': $('<img>', {
                        'width': "16px", 'height': "16px", 'src': '../img/playlist-icon.png', 'alt': ''
                    })
                }),
                'append': $('<span>', {
                    'class': 'span-opacity list-item-title', 'html': item.name
                })
            }).click(function () {
                show_this_pl(item.name)
            }).on('drop dragover', function (event) {
                switch (event.type) {
                    case 'drop':
                        var song = JSON.parse(event.originalEvent.dataTransfer.getData('song'));
                        add_to_playlist(song.name, item.name);
                        break;
                    case 'dragover':
                        event.preventDefault();
                        break;

                }
            }).appendTo($wrapper);
        });
    });
}

/**
 * show the default top bar with the searh form
 */
function show_default_top_header() {
    const html = $.parseHTML('<div class="topbar-content"><div class="topbar-content-search"><form><input class="search-input text-format-14" maxlength="800" placeholder="Artisti, brani o playlist"></form><div class="search-inside"><span class="search-inside-span"><svg height="24" width="24" viewBox="0 0 24 24"><path d="M16.387 16.623A8.47 8.47 0 0019 10.5a8.5 8.5 0 10-8.5 8.5 8.454 8.454 0 005.125-1.73l4.401 5.153.76-.649-4.399-5.151zM10.5 18C6.364 18 3 14.636 3 10.5S6.364 3 10.5 3 18 6.364 18 10.5 14.636 18 10.5 18z"></path></svg></span></div></div></div>');
    $(".main-topbar-header .topbar-wrapper").empty().append(html);
}

/**
 * show the library top bar with the subsection:
 * - Artist
 * - Album
 * - Playlist
 */
function show_library_top_header() {
    $library_top_header = $('<ul>', {
        'class': 'main-topbar-ul', 'prepend': $('<li>', {
            'class': 'li-item', 'prepend': $('<div>', {'class': 'link-item link-item-selected', 'html': 'Artisti'})
        }), 'append': $('<li>', {
            'class': 'li-item', 'prepend': $('<div>', {'class': 'link-item', 'html': 'Album'})
        })
    }).append($('<li>', {
        'class': 'li-item', 'prepend': $('<div>', {'class': 'link-item', 'html': 'Playlist'})
    }));
    $('.topbar-wrapper').empty().append($library_top_header);

    $(".link-item").on("click", function () {
        $("li .link-item").removeClass("link-item-selected");
        $(this).addClass("link-item-selected");
        switch ($(this).text()) {
            case "Album":
                show_albums();
                break;
            case "Artisti":
                show_artists();
                break;
            case "Playlist":
                show_playlists();
                break;
        }
    });
}

/**
 * show an empty section with a specific message to entice the user to save songs into his library
 * @param item
 */
function show_empty_section(item) {
    var $wrapper = $('<div>', {'class': 'empty-section'}).appendTo(".main-view-container");
    $wrapper.append($('<div>', {
        'class': 'empty-section-message', 'html': $('<div>', {
            'html': 'Non ci sono ' + item + ' nella tua libreria, esplora per aggiungere dei contenuti'
        }), 'append': $('<div>', {'class': 'empty-section-explore-btn', 'html': 'Esplora'}).click(show_homepage),
    }))
}

/**
 * show the homepage section with:
 * - top artists
 * - tracks
 */
function show_homepage() {
    $(".main-view-container").empty();
    $("#saved-songs").children().removeClass("active-playlist");
    $("#library").removeClass("link-section-active");
    $("#home").addClass("link-section-active");
    show_default_top_header()

    const artists_section = $.parseHTML('<div class="main-view-container-top-spacer"></div>' + '<div class="main-view-grid-template" style="--minimumColumnWidth:180px;">' + '<div class="grid-column-template">' + '<section class="top-artists">' + '<div class="top-artists-title">' + '<h2 class="section-title-h2">Gli artisti top</h2></div>' + '<div class="top-artists-section"><div class="scroll-wrapper">' + '<div class="main-view-grid-template homepage-grid-content-disposition">' + '<div class="next-button-area">' + '<button title="Avanti" class="next-button">' + '<div class="next-button-border-area">' + '<span class="next-button-span">' + '<svg height="24" width="24" viewBox="0 0 24 24" class="">' + '<path d="M7.96 21.151l-.649-.761 9.554-8.161-9.554-8.16.649-.76 10.445 8.92z">' + '</path></svg></span></div></button></div>' + '<div class="prev-button-area">' + '<button title="Avanti" class="next-button">' + '<div class="next-button-border-area">' + '<span class="prev-button-span">' + '<svg height="24" width="24" viewBox="0 0 24 24" class="">' + '<path d="M7.96 21.151l-.649-.761 9.554-8.161-9.554-8.16.649-.76 10.445 8.92z">' + '</path></svg></span></div></button></div>');

    $('<div>', {'class': 'main-view-container-top-spacer'}).appendTo(".main-view-container");
    $('<div>', {
        'class': "main-view-grid-template", 'style': "--minimumColumnWidth:180px;", 'prepend': $('<div>', {
            'class': 'grid-column-template', 'prepend': $('<section>', {
                'class': 'top-artists', 'prepend': $('<div>', {
                    'class': 'top-artists-title', 'prepend': $('<h2>', {
                        'class': 'section-title-h2', 'html': 'Gli artisti top'
                    })
                }), 'append': $('<div>', {
                    'class': 'top-artists-section', 'prepend': $('<div>', {
                        'id': 'scroll', 'class': 'scroll-wrapper', 'prepend': $('<div>', {
                            'class': 'main-view-grid-template homepage-grid-content-disposition',
                            'prepend': $('<div>', {
                                'class': 'next-button-area', 'prepend': $('<button>', {
                                    'class': 'next-button', 'title': 'Avanti', 'prepend': $('<div>', {
                                        'class': 'next-button-border-area', 'prepend': $('<span>', {
                                            'class': 'next-button-span',
                                            'prepend': $.parseHTML('<svg height="24" width="24" viewBox="0 0 24 24" class="">' + '<path d="M7.96 21.151l-.649-.761 9.554-8.161-9.554-8.16.649-.76 10.445 8.92z">' + '</path></svg>')
                                        }),
                                    })
                                }).click(function () {
                                    slide(this.title);
                                }),
                            }),
                            'append': $('<div>', {
                                'class': 'prev-button-area', 'prepend': $('<button>', {
                                    'class': 'next-button', 'title': 'Indietro', 'prepend': $('<div>', {
                                        'class': 'next-button-border-area', 'prepend': $('<span>', {
                                            'class': 'prev-button-span',
                                            'prepend': $.parseHTML('<svg height="24" width="24" viewBox="0 0 24 24" class="">' + '<path d="M7.96 21.151l-.649-.761 9.554-8.161-9.554-8.16.649-.76 10.445 8.92z">' + '</path></svg>')
                                        }),
                                    })
                                }).click(function () {
                                    slide(this.title);
                                }),
                            }),
                        }),
                    })
                }),
            })
        })
    }).appendTo(".main-view-container");

    $.getJSON("./requests.php", "username=" + username + "&type=all_artists", function (json) {
        json.artists.forEach(function (item) {
            var x = Math.floor(Math.random() * 200);
            var y = Math.floor(Math.random() * 200);
            var z = Math.floor(Math.random() * 200);
            $('<div>', {
                'class': 'single-section-link',
                'style': 'background-color: rgb(' + x + ', ' + y + ', ' + z + ')',
                'prepend': $('<h3>', {
                    'class': 'single-section-title', 'html': item.artist
                }),
                'append': $('<img>', {
                    'draggable': 'false',
                    'src': '../media/' + item.artist + '/artist.jpg',
                    'alt': item.artist,
                    'class': 'section-image',
                })
            }).click(function () {
                show_this_artist(item.artist, "all");
            }).appendTo(".homepage-grid-content-disposition");
        });
    });

    const song_section = $.parseHTML('<section class="browse-all">' + '<div class="browse-all-title"><h2 class="section-title-h2">Sfoglia tutti i brani</h2></div>' + '<div class="main-view-grid-template" style="--minimumColumnWidth:211px;">');
    $(".grid-column-template").append(song_section);
    $.getJSON("./requests.php", "username=" + username + "&type=all_songs", function (json) {
        json.songs.forEach(function (item) {
            $play_button_svg = $.parseHTML('<svg height="16" width="16" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path>' + '</svg>');

            $saved_button_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" >' + '<path fill="none" d="M0 0h16v16H0z"></path>' + '<path d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"></path>' + '</svg>');

            $not_saved_button_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" class="Svg-sc-1bi12j5-0 hDgDGI"><path d="M13.764 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253A4.05 4.05 0 00.974 5.61c0 1.089.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195A4.052 4.052 0 0014.96 5.61a4.057 4.057 0 00-1.196-2.883zm-.722 5.098L8.58 13.048c-.307.36-.921.36-1.228 0L2.864 7.797a3.072 3.072 0 01-.905-2.187c0-.826.321-1.603.905-2.187a3.091 3.091 0 012.191-.913 3.05 3.05 0 011.957.709c.041.036.408.351.954.351.531 0 .906-.31.94-.34a3.075 3.075 0 014.161.192 3.1 3.1 0 01-.025 4.403z"></path></svg>');

            var x = Math.floor(Math.random() * 200);
            var y = Math.floor(Math.random() * 200);
            var z = Math.floor(Math.random() * 200);

            $play_button = $('<button>', {
                'class': 'browse-all-song-play-button transition-button', 'append': $play_button_svg
            }).click(function () {
                play_this(item.name, item.artist, item.album);
            });

            $save_button = $('<span>', {
                'class': 'browse-all-song-save-button'
            });

            if (song_already_owned(item.name)) {
                $save_button.empty().append($saved_button_svg);
            } else {
                $save_button.empty().append($not_saved_button_svg);
            }

            $save_button.click(function () {
                if (song_already_owned(item.name)) {
                    $(this).empty().append($.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" class="Svg-sc-1bi12j5-0 hDgDGI"><path d="M13.764 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253A4.05 4.05 0 00.974 5.61c0 1.089.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195A4.052 4.052 0 0014.96 5.61a4.057 4.057 0 00-1.196-2.883zm-.722 5.098L8.58 13.048c-.307.36-.921.36-1.228 0L2.864 7.797a3.072 3.072 0 01-.905-2.187c0-.826.321-1.603.905-2.187a3.091 3.091 0 012.191-.913 3.05 3.05 0 011.957.709c.041.036.408.351.954.351.531 0 .906-.31.94-.34a3.075 3.075 0 014.161.192 3.1 3.1 0 01-.025 4.403z"></path></svg>'));
                    remove_this_from_library(item.name);

                } else {
                    $(this).empty().append($.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" >' + '<path fill="none" d="M0 0h16v16H0z"></path>' + '<path d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"></path>' + '</svg>'));
                    add_song_to_library(item.name);
                }
            });

            $cover = $('<img>', {
                'draggable': 'false',
                'src': '../media/' + item.artist + '/' + item.album + '/cover.jpg',
                'alt': '',
                'class': 'image single-browse-all-image',
            });

            $h3 = $('<h3>', {'class': 'single-browse-all-h3', 'html': item.name});

            $h4 = $('<h4>', {'class': 'single-browse-all-h4', 'html': item.artist});

            $('<div>', {
                'draggable': 'true',
                'class': 'single-browse-all-link',
                'style': 'background-color: rgb(' + x + ', ' + y + ', ' + z + ')',
            }).append($play_button)
                .append($cover)
                .append($save_button)
                .append($h3)
                .append($h4)
                .on("mouseover mouseout", function (event) {
                    switch (event.type) {
                        case "mouseover":
                            $(this).children("button").show();
                            $(this).children("span").show();
                            $(this).children("img").css("opacity", ".7");
                            break;
                        case "mouseout":
                            $(this).children("button").hide();
                            $(this).children("span").hide();
                            $(this).children("img").css("opacity", "1");
                            break;
                    }
                })
                .on("dragstart", function (event) {
                    var song = {
                        name: $(event.target).find('h3.single-browse-all-h3').text(),
                        artist: $(event.target).find('h4.single-browse-all-h4').text()
                    };
                    event.originalEvent.dataTransfer.setData("song", JSON.stringify(song));
                })
                .appendTo(".browse-all .main-view-grid-template");
        });
    });
}

/**
 * show the user artist in his library
 */
function show_artists() {
    $(".main-view-container").empty();
    $("#home").removeClass("link-section-active");
    $("#library").addClass("link-section-active");

    $.getJSON("./requests.php", "type=user_artists&username=" + username, function (json) {
        if (json.artists.length > 0) {
            $('<div>', {
                'class': 'main-view-container-top-spacer',
            }).appendTo(".main-view-container");
            $('<section>', {
                'class': 'library-artist', 'prepend': $('<div>', {
                    'class': 'top-artists-title', 'prepend': $('<h2>', {
                        'class': 'section-title-h2', 'html': 'Artisti'
                    })
                }), 'append': $('<div>', {
                    'id': 'content', 'class': 'main-view-grid-template', 'style': '--minimumColumnWidth: 86px'
                })
            }).appendTo(".main-view-container");

            json.artists.forEach(function (item) {
                $play_button_svg = $.parseHTML('<svg height="20" width="20" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path>' + '</svg>');

                $play_button = $('<button>', {
                    'class': 'library-artist-play-button transition-button', 'append': $play_button_svg
                }).click(function (e) {
                    e.stopPropagation();
                    play_artist(item.name);
                });

                $('<a>', {
                    'draggable': 'false', 'class': 'single-library-artist', 'prepend': $('<img>', {
                        'draggable': 'false',
                        'src': '../media/' + item.name + '/artist.jpg',
                        'class': 'library-artist-image',
                        'alt': item.name
                    }), 'append': $('<h3>', {
                        'class': 'library-artist-title', 'html': item.name
                    }),
                }).append($play_button)
                    .click(function () {
                        show_this_artist(item.name)
                    })
                    .on("mouseover mouseout", function (event) {
                        switch (event.type) {
                            case "mouseover":
                                $(this).children("button").show();
                                break;
                            case "mouseout":
                                $(this).children("button").hide();
                                break;
                        }
                    }).appendTo("#content");
            });
        } else {
            show_empty_section('artisti');
        }
    });
}

/**
 * show the user albums in his library
 */
function show_albums() {
    $(".main-view-container").empty();
    $.getJSON("./requests.php", "type=user_albums&username=" + username, function (json) {
        if (json.albums.length > 0) {
            $('<div>', {
                'class': 'main-view-container-top-spacer',
            }).appendTo(".main-view-container");
            $('<section>', {
                'class': 'library-artist', 'prepend': $('<div>', {
                    'class': 'top-artists-title', 'prepend': $('<h2>', {
                        'class': 'section-title-h2', 'html': 'Album'
                    })
                }), 'append': $('<div>', {
                    'id': 'content', 'class': 'main-view-grid-template', 'style': '--minimumColumnWidth: 86px'
                })
            }).appendTo(".main-view-container");

            json.albums.forEach(function (item) {
                $play_button_svg = $.parseHTML('<svg height="20" width="20" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path>' + '</svg>');

                $play_button = $('<button>', {
                    'class': 'library-artist-play-button transition-button', 'append': $play_button_svg
                }).click(function (e) {
                    e.stopPropagation();
                    play_album(item.album, item.artist);
                });

                $('<a>', {
                    'draggable': 'false', 'class': 'single-library-artist', 'prepend': $('<img>', {
                        'draggable': 'false',
                        'src': '../media/' + item.artist + '/' + item.album + '/cover.jpg',
                        'class': 'library-artist-image',
                        'alt': item.album
                    }), 'append': $('<h3>', {'class': 'library-album-title', 'html': item.album}),
                }).append($play_button)
                    .click(function () {
                        show_this_album(item.album, item.artist);
                    })
                    .on("mouseover mouseout", function (event) {
                        switch (event.type) {
                            case "mouseover":
                                $(this).children("button").show();
                                break;
                            case "mouseout":
                                $(this).children("button").hide();
                                break;
                        }
                    }).appendTo("#content");
            });
        } else {
            show_empty_section('album');
        }
    });
}

/**
 * show the user playlists in his library
 */
function show_playlists() {
    $(".main-view-container").empty();
    $.getJSON("./requests.php", "type=user_playlists&username=" + username, function (json) {
        if (json.playlists.length > 0) {
            $('<div>', {
                'class': 'main-view-container-top-spacer',
            }).appendTo(".main-view-container");
            $('<section>', {
                'class': 'library-artist', 'prepend': $('<div>', {
                    'class': 'top-artists-title', 'prepend': $('<h2>', {
                        'class': 'section-title-h2', 'html': 'Playlist'
                    })
                }), 'append': $('<div>', {
                    'id': 'content', 'class': 'main-view-grid-template', 'style': '--minimumColumnWidth: 86px'
                })
            }).appendTo(".main-view-container");

            json.playlists.forEach(function (item) {
                $play_button_svg = $.parseHTML('<svg height="20" width="20" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path>' + '</svg>');

                $play_button = $('<button>', {
                    'class': 'library-playlist-play-button transition-button', 'append': $play_button_svg
                }).click(function (e) {
                    e.stopPropagation();
                    play_playlist(item.name);
                });

                $nsongs_in_playlist = $('<h4>', {
                    'class': '', 'html': item.length == 1 ? item.length + ' brano' : item.length + ' brani'
                });

                $('<a>', {
                    'draggable': 'false', 'class': 'single-library-artist', 'prepend': $('<img>', {
                        'draggable': 'false',
                        'src': '../img/playlist-icon.png',
                        'class': 'library-playlist-image',
                        'alt': item.name
                    }), 'append': $('<h3>', {'class': 'library-playlist-title', 'html': item.name}),
                }).append($play_button)
                    .append($nsongs_in_playlist)
                    .click(function () {
                        show_this_pl(item.name);
                    })
                    .on("mouseover mouseout", function (event) {
                        switch (event.type) {
                            case "mouseover":
                                $(this).children("button").show();
                                break;
                            case "mouseout":
                                $(this).children("button").hide();
                                break;
                        }
                    }).appendTo("#content");
            });
        } else {
            show_empty_section('playlist');
        }
    });
}

/**
 * show a specified artist and his songs
 * @param artist
 * @param all defines whether to display all artist songs or only those saved by the user
 */
function show_this_artist(artist, all) {
    $(".main-view-container").empty();
    $.getJSON("./requests.php", "username=" + username + "&artist=" + artist + "&type=" + ((all) ? "all_artist_songs" : "user_artist_songs"), function (json) {
        $header = $('<div>', {
            'class': 'header', 'prepend': $('<div>', {
                'class': 'playlist-image', 'append': $('<img>', {
                    'draggable': "false", 'src': '../media/' + artist + '/artist.jpg', 'alt': artist,
                })
            }), 'append': $('<div>', {
                'class': 'playlist-name', 'prepend': $('<h2>', {'class': '', 'html': 'artista'}), 'append': $('<h1>', {
                    'class': '', 'html': artist,
                }),
            }).append($('<span>', {
                'class': '',
                'html': ((json.albums) ? json.albums[0].genre + ' - ' : "") + (json.nsongs == 1 ? json.nsongs + ' brano' : json.nsongs + ' brani')
            }))
        })

        $play_button_svg = $.parseHTML('<svg height="28" width="28" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path>' + '</svg>');

        $play_button = $('<button>', {
            'class': 'playlist-play-button transition-button', 'append': $play_button_svg
        }).click(function (e) {
            play_artist(artist, all);
        });

        $backgroud_fade = $('<div>', {'class': 'background-fade'});

        $('<div>', {
            'class': 'main-view-container-top-spacer',
        }).appendTo(".main-view-container");
        $duration_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M7.999 3h-1v5h3V7h-2V3zM7.5 0a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 14C3.916 14 1 11.084 1 7.5S3.916 1 7.5 1 14 3.916 14 7.5 11.084 14 7.5 14z"></path><path fill="none" d="M16 0v16H0V0z"></path></svg>');
        $playlist_content = $('<div>', {
            'class': 'playlist-content', 'prepend': $('<div>', {
                'class': 'content-header',
                'prepend': $('<span>', {'class': 'content-title grid-number', 'html': '#'}),
                'append': $('<span>', {'class': 'content-title grid-title', 'html': 'titolo'}),
            }).append($('<span>', {'class': 'content-title grid-album', 'html': 'album'}))
                .append($('<span>', {'class': 'content-title grid-duration', 'html': 'durata'})), 'append': $('<div>', {
                'class': 'content-songs'
            })
        })

        $('<section>', {
            'class': 'playlist', 'prepend': $header, 'append': $backgroud_fade
        }).append($play_button).append($playlist_content).appendTo(".main-view-container");

        json?.albums?.forEach(function (item) {
            let i = 1;
            item?.songs?.forEach(function (song) {
                $number = $('<div>', {
                    'class': 'song-number', 'prepend': $('<span>', {'class': '', 'html': i}), 'append': $('<button>', {
                        'class': 'song-play-button',
                        'append': $.parseHTML('<svg height="16" width="16" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path></svg>')
                    }).click(function () {
                        play_this(song.songname, artist, item.albumname);
                    })
                });
                $song_image = $('<div>', {
                    'class': 'song-title', 'prepend': $('<img>', {
                        'class': 'row-song-image', 'src': '../media/' + artist + '/' + item.albumname + '/cover.jpg'
                    }), 'append': $('<div>', {
                        'class': 'song-info',
                        'prepend': $('<span>', {'class': 'title', 'html': song.songname}),
                        'append': $('<span>', {'class': 'artist', 'html': artist}),
                    })
                });
                $album_info = $('<div>', {
                    'class': 'album-title', 'html': item.albumname
                });
                $duration_info = $('<div>', {
                    'class': 'album-title', 'html': song.length.split("00:").pop()
                });
                $saved_button_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" >' + '<path fill="none" d="M0 0h16v16H0z"></path>' + '<path d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"></path>' + '</svg>');

                $save_button = $('<span>', {
                    'class': '', 'append': $saved_button_svg
                });

                if (song_already_owned(song.songname)) {
                    $save_button.addClass('control-button-active');
                }

                $save_button.click(function () {
                    if (song_already_owned(song.songname)) {
                        remove_this_from_library(song.songname);
                        $(this).removeClass('control-button-active');
                        if (!all) {
                            show_this_artist(artist, all)
                        }
                    } else {
                        add_song_to_library(song.songname);
                        $(this).addClass('control-button-active');
                    }
                });

                $option_button = $('<div>', {
                    'class': 'option-button',
                    'prepend': $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16">' + '<path d="M2 6.5a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 002 6.5zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 0014 6.5z"></path>' + '</svg>'),
                    'append': $('<div>', {
                        'class': 'song-option-widget', 'prepend': $('<ul>', {
                            'class': 'user-settings-list', 'prepend': $('<li>', {
                                'class': 'song-option-item', 'html': 'Aggiungi in coda'
                            }).click(add_song_queue), 'append': $('<li>', {
                                'class': 'song-option-item',
                                'html': 'Aggiungi alla playlist',
                                'append': $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M14 10L8 4l-6 6h12z"></path></svg>')
                            }).hover(show_playlist_menu)
                        })
                    })
                }).click(function () {
                    if ($(this).find('.song-option-widget').is(':hidden')) {
                        $(this).find('.admin-option-item').remove();
                        if (is_admin && check_hidden_song(song.songname)) {
                            $(this).find('ul.user-settings-list')
                                .append($('<li>', {
                                    'class': 'admin-option-item', 'html': 'Mostra brano',
                                }).click(function () {
                                    show_this_song(song.songname);
                                    show_this_artist(artist, all);
                                }));
                        } else if (is_admin && !check_hidden_song(song.songname)) {
                            $(this).find('.user-settings-list').append($('<div>', {
                                'class': 'admin-option-item', 'html': 'Nascondi brano',
                            }).click(function () {
                                hide_this_song(song.songname)
                                show_this_artist(artist, all);
                            }));
                        }
                    }
                    $(this).find('.song-option-widget').toggle();
                });

                $('<div>', {
                    'class': 'row-song', 'prepend': $number, 'append': $song_image
                }).append($album_info)
                    .append($save_button)
                    .append($duration_info)
                    .append($option_button)
                    .on("mouseover mouseout", function (event) {
                        switch (event.type) {
                            case "mouseover":
                                $(this).children().children(".song-play-button").show();
                                $(this).children('.song-number').children("span").hide();
                                $(this).children(".option-button").show();
                                break;
                            case "mouseout":
                                $(this).children().children(".song-play-button").hide();
                                $(this).children('.song-number').children("span").show();
                                if ($(this).find('.song-option-widget').is(':hidden')) {
                                    $(this).children(".option-button").hide();
                                }
                                break;
                        }
                    }).appendTo('.content-songs');

                if (check_hidden_song(song.songname)) {
                    hide_song_visually($('.content-songs').children().eq(i - 1));
                }
                i++;
            })

        });
    });
}

/**
 * show a specified album and its songs
 * @param album
 * @param artist
 * @param all defines whether to display all album songs or only those saved by the user
 */
function show_this_album(album, artist, all) {
    $(".main-view-container").empty();
    $.getJSON("./requests.php", "username=" + username + "&album=" + album + "&type=" + ((all) ? "all_album_songs" : "user_album_songs"), function (json) {
        $header = $('<div>', {
            'class': 'header', 'prepend': $('<div>', {
                'class': 'playlist-image', 'append': $('<img>', {
                    'draggable': "false", 'src': '../media/' + artist + '/' + album + '/cover.jpg', 'alt': album,
                })
            }), 'append': $('<div>', {
                'class': 'playlist-name', 'prepend': $('<h2>', {'class': '', 'html': 'album'}), 'append': $('<h1>', {
                    'class': '', 'html': album,
                }),
            }).append($('<span>', {
                'class': '',
                'html': ((json.genre) ? json.genre + ' - ' : "") + (json.nsongs == 1 ? json.nsongs + ' brano' : json.nsongs + ' brani')
            }))
        })

        $play_button_svg = $.parseHTML('<svg height="28" width="28" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path>' + '</svg>');

        $play_button = $('<button>', {
            'class': 'playlist-play-button transition-button', 'append': $play_button_svg
        }).click(function (e) {
            play_album(album, artist, all);
        });

        $backgroud_fade = $('<div>', {'class': 'background-fade'});

        $('<div>', {
            'class': 'main-view-container-top-spacer',
        }).appendTo(".main-view-container");
        $duration_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M7.999 3h-1v5h3V7h-2V3zM7.5 0a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 14C3.916 14 1 11.084 1 7.5S3.916 1 7.5 1 14 3.916 14 7.5 11.084 14 7.5 14z"></path><path fill="none" d="M16 0v16H0V0z"></path></svg>');
        $playlist_content = $('<div>', {
            'class': 'playlist-content', 'prepend': $('<div>', {
                'class': 'content-header',
                'prepend': $('<span>', {'class': 'content-title grid-number', 'html': '#'}),
                'append': $('<span>', {'class': 'content-title grid-title', 'html': 'titolo'}),
            }).append($('<span>', {'class': 'content-title grid-album', 'html': 'album'}))
                .append($('<span>', {'class': 'content-title grid-duration', 'html': 'durata'})), 'append': $('<div>', {
                'class': 'content-songs'
            })
        })

        $('<section>', {
            'class': 'playlist', 'prepend': $header, 'append': $backgroud_fade
        }).append($play_button)
            .append($playlist_content)
            .appendTo(".main-view-container");

        let i = 1;
        json.songs.forEach(function (song) {
            $number = $('<div>', {
                'class': 'song-number', 'prepend': $('<span>', {'class': '', 'html': i}), 'append': $('<button>', {
                    'class': 'song-play-button',
                    'append': $.parseHTML('<svg height="16" width="16" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path></svg>')
                }).click(function () {
                    play_this(song.name, artist, album);
                })
            });
            $song_image = $('<div>', {
                'class': 'song-title', 'prepend': $('<img>', {
                    'class': 'row-song-image', 'src': '../media/' + artist + '/' + album + '/cover.jpg'
                }), 'append': $('<div>', {
                    'class': 'song-info',
                    'prepend': $('<span>', {'class': 'title', 'html': song.name}),
                    'append': $('<span>', {'class': 'artist', 'html': artist}),
                })
            });
            $album_info = $('<div>', {
                'class': 'album-title', 'html': album
            });
            $duration_info = $('<div>', {
                'class': 'album-title', 'html': song.length.split("00:").pop()
            });

            $saved_button_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" >' + '<path fill="none" d="M0 0h16v16H0z"></path>' + '<path d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"></path>' + '</svg>');

            $save_button = $('<span>', {
                'class': '', 'append': $saved_button_svg
            });

            if (song_already_owned(song.name)) {
                $save_button.addClass('control-button-active');
            }

            $save_button.click(function () {
                if (song_already_owned(song.name)) {
                    remove_this_from_library(song.name);
                    $(this).removeClass('control-button-active');
                    if (!all) {
                        show_this_album(album, artist, all)
                    }
                } else {
                    add_song_to_library(song.name);
                    $(this).addClass('control-button-active');
                }
            });

            $option_button = $('<div>', {
                'class': 'option-button',
                'prepend': $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16">' + '<path d="M2 6.5a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 002 6.5zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 0014 6.5z"></path>' + '</svg>'),
                'append': $('<div>', {
                    'class': 'song-option-widget', 'prepend': $('<ul>', {
                        'class': 'user-settings-list', 'prepend': $('<li>', {
                            'class': 'song-option-item', 'html': 'Aggiungi in coda'
                        }).click(add_song_queue), 'append': $('<div>', {
                            'class': 'song-option-item',
                            'html': 'Aggiungi alla playlist',
                            'append': $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M14 10L8 4l-6 6h12z"></path></svg>')
                        }).hover(show_playlist_menu)
                    })
                })
            }).click(function () {
                $(this).find('.song-option-widget').toggle();
            });

            $('<div>', {
                'class': 'row-song', 'prepend': $number, 'append': $song_image
            }).append($album_info)
                .append($save_button)
                .append($duration_info)
                .append($option_button)
                .on("mouseover mouseout", function (event) {
                    switch (event.type) {
                        case "mouseover":
                            $(this).children().children(".song-play-button").show();
                            $(this).children('.song-number').children("span").hide();
                            $(this).children(".option-button").show();
                            break;
                        case "mouseout":
                            $(this).children().children(".song-play-button").hide();
                            $(this).children('.song-number').children("span").show();
                            if ($(this).find('.song-option-widget').is(':hidden')) {
                                $(this).children(".option-button").hide();
                            }
                            break;
                    }
                })
                .appendTo('.content-songs');

            i++;
        });
    });
}

/**
 * show a specified playlist and its songs
 * @param playlist
 */
function show_this_pl(playlist) {
    $(".main-view-container").empty();
    $("#saved-songs").children().removeClass("active-playlist");
    $("#home").removeClass("link-section-active");
    $("#library").removeClass("link-section-active");
    $("#user-playlist").children().children().removeClass("active-playlist");
    $("#" + $(this).attr('id')).addClass("active-playlist");

    $.getJSON("./requests.php", "username=" + username + "&type=songs_into_pl&pl_name=" + playlist, function (json) {
        $header = $('<div>', {
            'class': 'header', 'prepend': $('<div>', {
                'class': 'playlist-image', 'append': $('<img>', {
                    'draggable': "false", 'src': '../img/playlist_icon_large.png', 'alt': playlist,
                })
            }), 'append': $('<div>', {
                'class': 'playlist-name', 'prepend': $('<h2>', {'class': '', 'html': 'Playlist'}), 'append': $('<h1>', {
                    'class': '', 'html': playlist,
                }),
            }).append($('<span>', {'class': '', 'html': json.nsongs + ' brani'}))
        })

        $play_button_svg = $.parseHTML('<svg height="28" width="28" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path>' + '</svg>');

        $play_button = $('<button>', {
            'class': 'playlist-play-button transition-button', 'append': $play_button_svg
        }).click(function (e) {
            play_playlist(playlist);
        });

        $backgroud_fade = $('<div>', {'class': 'background-fade'});

        $('<div>', {
            'class': 'main-view-container-top-spacer',
        }).appendTo(".main-view-container");
        $duration_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M7.999 3h-1v5h3V7h-2V3zM7.5 0a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 14C3.916 14 1 11.084 1 7.5S3.916 1 7.5 1 14 3.916 14 7.5 11.084 14 7.5 14z"></path><path fill="none" d="M16 0v16H0V0z"></path></svg>');
        $playlist_content = $('<div>', {
            'class': 'playlist-content', 'prepend': $('<div>', {
                'class': 'content-header',
                'prepend': $('<span>', {'class': 'content-title grid-number', 'html': '#'}),
                'append': $('<span>', {'class': 'content-title grid-title', 'html': 'titolo'}),
            }).append($('<span>', {'class': 'content-title grid-album', 'html': 'album'}))
                .append($('<span>', {'class': 'content-title grid-duration', 'html': 'durata'})), 'append': $('<div>', {
                'class': 'content-songs'
            })
        })

        $('<section>', {
            'class': 'playlist', 'prepend': $header, 'append': $backgroud_fade
        }).append($play_button).append($playlist_content).appendTo(".main-view-container");

        let i = 1;
        json.songs.forEach(function (song) {
            $number = $('<div>', {
                'class': 'song-number', 'prepend': $('<span>', {'class': '', 'html': i}), 'append': $('<button>', {
                    'class': 'song-play-button',
                    'append': $.parseHTML('<svg height="16" width="16" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path></svg>')
                }).click(function () {
                    play_this(song.name, song.artist, song.album);
                })
            });
            $song_image = $('<div>', {
                'class': 'song-title', 'prepend': $('<img>', {
                    'class': 'row-song-image', 'src': '../media/' + song.artist + '/' + song.album + '/cover.jpg'
                }), 'append': $('<div>', {
                    'class': 'song-info',
                    'prepend': $('<span>', {'class': 'title', 'html': song.name}),
                    'append': $('<span>', {'class': 'artist', 'html': song.artist}),
                })
            });
            $album_info = $('<div>', {
                'class': 'album-title', 'html': song.album
            });
            $duration_info = $('<div>', {
                'class': 'album-title', 'html': song.length.split("00:").pop()
            });
            $saved_button_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" >' + '<path fill="none" d="M0 0h16v16H0z"></path>' + '<path d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"></path>' + '</svg>');

            $save_button = $('<span>', {
                'class': '', 'append': $saved_button_svg
            });
            $option_button = $('<div>', {
                'class': 'option-button',
                'prepend': $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16">' + '<path d="M2 6.5a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 002 6.5zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 0014 6.5z"></path>' + '</svg>'),
                'append': $('<div>', {
                    'class': 'song-option-widget', 'prepend': $('<ul>', {
                        'class': 'user-settings-list', 'prepend': $('<li>', {
                            'class': 'song-option-item', 'html': 'Aggiungi in coda'
                        }).click(add_song_queue), 'append': $('<div>', {
                            'class': 'song-option-item',
                            'html': 'Aggiungi alla playlist',
                            'append': $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M14 10L8 4l-6 6h12z"></path></svg>')
                        }).hover(show_playlist_menu)
                    }).append($('<li>', {
                        'class': 'song-option-item', 'html': 'Rimuovi dalla playlist'
                    }).click(function () {
                        remove_this_from_pl(playlist, song.name);
                        show_this_pl(playlist);
                    }))
                })
            }).click(function () {
                $(this).find('.song-option-widget').toggle();
            });

            if (!song_already_owned(song.name)) {
                $save_button.addClass('control-button-active');
                $save_button.click(function () {
                    remove_this_from_library(song.name);
                    $save_button.toggleClass('control-button-active');
                })
            } else {
                $save_button.click(function () {
                    add_song_to_library(song.name);
                    $save_button.toggleClass('control-button-active');
                })
            }

            $('<div>', {
                'class': 'row-song', 'prepend': $number, 'append': $song_image
            }).append($album_info)
                .append($save_button)
                .append($duration_info)
                .append($option_button)
                .on("mouseover mouseout", function (event) {
                    switch (event.type) {
                        case "mouseover":
                            $(this).children().children(".song-play-button").show();
                            $(this).children('.song-number').children("span").hide();
                            $(this).children(".option-button").show();
                            break;
                        case "mouseout":
                            $(this).children().children(".song-play-button").hide();
                            $(this).children('.song-number').children("span").show();
                            if ($(this).find('.song-option-widget').is(':hidden')) {
                                $(this).children(".option-button").hide();
                            }
                            break;
                    }
                })
                .appendTo('.content-songs');

            i++;
        });

    });
}

/**
 * show the user saved songs
 */
function show_songs() {
    $(".main-view-container").empty();

    $.getJSON("./requests.php", "type=user_songs&username=" + username, function (json) {
        if (json.songs.length > 0) {
            $header = $('<div>', {
                'class': 'header', 'prepend': $('<div>', {
                    'class': 'playlist-image', 'append': $('<img>', {
                        'draggable': "false",
                        'src': "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png",
                        'alt': "Brani che ti piacciono",
                    })
                }), 'append': $('<div>', {
                    'class': 'playlist-name',
                    'prepend': $('<h2>', {'class': '', 'html': 'Playlist'}),
                    'append': $('<h1>', {
                        'class': '', 'html': 'Brani che ti piacciono',
                    }),
                }).append($('<span>', {'class': '', 'html': json.nsongs + ' brani'}))
            })


            $play_button_svg = $.parseHTML('<svg height="28" width="28" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path>' + '</svg>');

            $play_button = $('<button>', {
                'class': 'playlist-play-button transition-button', 'append': $play_button_svg
            }).click(function (e) {
                play_library();
            });

            $backgroud_fade = $('<div>', {'class': 'background-fade'});

            $('<div>', {
                'class': 'main-view-container-top-spacer',
            }).appendTo(".main-view-container");
            $duration_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M7.999 3h-1v5h3V7h-2V3zM7.5 0a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 14C3.916 14 1 11.084 1 7.5S3.916 1 7.5 1 14 3.916 14 7.5 11.084 14 7.5 14z"></path><path fill="none" d="M16 0v16H0V0z"></path></svg>');
            $playlist_content = $('<div>', {
                'class': 'playlist-content',
                'prepend': $('<div>', {
                    'class': 'content-header',
                    'prepend': $('<span>', {'class': 'content-title grid-number', 'html': '#'}),
                    'append': $('<span>', {'class': 'content-title grid-title', 'html': 'titolo'}),
                }).append($('<span>', {'class': 'content-title grid-album', 'html': 'album'}))
                    .append($('<span>', {'class': 'content-title grid-duration', 'html': 'durata'})),
                'append': $('<div>', {
                    'class': 'content-songs'
                })
            })

            $('<section>', {
                'class': 'playlist', 'prepend': $header, 'append': $backgroud_fade
            }).append($play_button).append($playlist_content).appendTo(".main-view-container");

            let i = 1;
            json.songs.forEach(function (song) {
                $number = $('<div>', {
                    'class': 'song-number', 'prepend': $('<span>', {'class': '', 'html': i}), 'append': $('<button>', {
                        'class': 'song-play-button',
                        'append': $.parseHTML('<svg height="16" width="16" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path></svg>')
                    }).click(function () {
                        play_this(song.name, song.artist, song.album);
                    })
                });
                $song_image = $('<div>', {
                    'class': 'song-title', 'prepend': $('<img>', {
                        'class': 'row-song-image', 'src': '../media/' + song.artist + '/' + song.album + '/cover.jpg'
                    }), 'append': $('<div>', {
                        'class': 'song-info',
                        'prepend': $('<span>', {'class': 'title', 'html': song.name}),
                        'append': $('<span>', {'class': 'artist', 'html': song.artist}),
                    })
                });
                $album_info = $('<div>', {
                    'class': 'album-title', 'html': song.album
                });
                $duration_info = $('<div>', {
                    'class': 'album-title', 'html': song.length.split("00:").pop()
                });
                $saved_button_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" >' + '<path fill="none" d="M0 0h16v16H0z"></path>' + '<path d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"></path>' + '</svg>');

                $save_button = $('<span>', {
                    'class': 'control-button-active', 'append': $saved_button_svg
                }).click(function () {
                    remove_this_from_library(song.name);
                    show_songs();
                });
                $add_to_playlist_widget = $('<div>', {});
                $option_button = $('<div>', {
                    'class': 'option-button',
                    'prepend': $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16">' + '<path d="M2 6.5a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 002 6.5zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 0014 6.5z"></path>' + '</svg>'),
                    'append': $('<div>', {
                        'class': 'song-option-widget', 'prepend': $('<ul>', {
                            'class': 'user-settings-list', 'prepend': $('<li>', {
                                'class': 'song-option-item', 'html': 'Aggiungi in coda'
                            }).click(add_song_queue), 'append': $('<div>', {
                                'class': 'song-option-item',
                                'html': 'Aggiungi alla playlist',
                                'append': $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M14 10L8 4l-6 6h12z"></path></svg>')
                            }).hover(show_playlist_menu)
                        }).append($('<li>', {
                            'class': 'song-option-item', 'html': 'Rimuovi dalla libreria'
                        }).click(function () {
                            remove_this_from_library(song.name);
                            show_songs();
                        }))
                    })
                }).click(function () {
                    $(this).find('.song-option-widget').toggle();
                });

                $('<div>', {
                    'class': 'row-song', 'prepend': $number, 'append': $song_image
                }).append($album_info)
                    .append($save_button)
                    .append($duration_info)
                    .append($option_button)
                    .on("mouseover mouseout", function (event) {
                        switch (event.type) {
                            case "mouseover":
                                $(this).children().children(".song-play-button").show();
                                $(this).children(".option-button").show();
                                $(this).children('.song-number').children("span").hide();
                                break;
                            case "mouseout":
                                $(this).children().children(".song-play-button").hide();
                                if ($(this).find('.song-option-widget').is(':hidden')) {
                                    $(this).children(".option-button").hide();
                                }
                                $(this).children('.song-number').children("span").show();
                                break;
                        }
                    })
                    .appendTo('.content-songs');

                i++;
            });
        } else {
            show_empty_section('brani');
        }
    });
}

/**
 * show all playlist into the "add to playlist" option of selected song
 */
function show_playlist_menu() {
    $song_selected = $(this).parents(".row-song").find("span.title").text();
    $list = $(this);

    $list.children().slice(1).remove();
    $list.append($('<div>', {
        'class': 'option-playlist-widget', 'prepend': $('<ul>', {
            'class': 'user-settings-list'
        })
    }));

    $.getJSON("./requests.php", "type=user_playlists&username=" + username, function (json) {
        json.playlists.forEach(function (item) {
            $list.find('.user-settings-list').append($('<li>', {
                'class': 'song-option-item', 'html': item.name
            }).click(function () {
                add_to_playlist($song_selected, item.name);
            }))

        });
    });
}

/**
 * show the song to user
 * @param songname
 */
function show_this_song(songname) {
    $.get("./requests.php", "type=show_song&username=" + username + "&songname=" + songname, function (data) {
        return data == "OK";
    });
}

/**
 * hide the song from users
 * @param songname
 */
function hide_this_song(songname) {
    $.get("./requests.php", "type=hide_song&username=" + username + "&songname=" + songname, function (data) {
        return data == "OK";
    });
}

/**
 * change the opacity of the song to make the administrator understand that the song is hidden from users
 * @param element
 */
function hide_song_visually(element) {
    $(element).find('.song-number').addClass('hidden');
    $(element).find('.song-title').addClass('hidden');
    $(element).find('.control-button-active').addClass('hidden');
    $(element).find('.album-title').addClass('hidden');
}

/* Adding and removing functions */
/**
 * remove a song from user library
 * @param song
 */
function remove_this_from_library(song) {
    $.get("./requests.php", "type=remove_from_library&username=" + username + "&songname=" + song, function (data) {
        return data == "REMOVED";
    });
}

/**
 * remove a song from a user playlist
 * @param playlist
 * @param songname
 */
function remove_this_from_pl(playlist, songname) {
    $.get("./requests.php", "type=remove_from_pl&username=" + username + "&songname=" + songname + "&pl_name=" + playlist, function (data) {
        return data == "REMOVED";
    });
}

/**
 * check if a son is hidden to users
 * @param songname
 * @returns {boolean}
 */
function check_hidden_song(songname) {
    $result = "";
    $.ajax({
        type: "GET",
        url: "./requests.php",
        data: "songname=" + songname + "&type=check_hidden_song",
        dataType: "text",
        async: false,
        success: function (response) {
            $result = response;
        }
    });
    return $result == 'HIDDEN';
}

/**
 * shuffle the queue
 * @param array
 */
function shuffle_queue(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/**
 * reset the queue
 */
function reset_queue() {
    $(".queue-list").addClass("no_queued_items");
    queue = [];
    previous = [];
}

/**
 * function called from "add to queue" song option button listener. adds the selected song to queue
 */
function add_song_queue() {
    song = $(this).parents(".row-song").find("span.title").text();
    artist = $(this).parents(".row-song").find("span.artist").text();
    album = $(this).parents(".row-song").find("div.album-title").first().text();
    queue.push({
        'name': song, 'artist': artist, 'album': album
    });
};

/**
 * function called from "add to playlist" song option button listener. adds the selected song to the specified playlist
 */
function add_to_playlist(song_name, pl_name) {
    $.get("./requests.php", "username=" + username + "&type=insert_song_into_pl&pl_name=" + pl_name + "&songname=" + song_name, function (data) {
        return data == "ok";
    })
};

/**
 * add the specified song to user saved songs
 * @param song
 */
function add_song_to_library(song) {
    $.get("./requests.php", "type=add_song_to_lib&username=" + username + "&songname=" + song, function (data) {
        return data == "OK";
    });
}

/**
 * check if the song is already owned by the user
 * @param song
 * @returns {boolean}
 */
function song_already_owned(song) {
    $result = "";
    $.ajax({
        type: "GET",
        url: "./requests.php",
        data: "username=" + username + "&songname=" + song + "&type=check_owned_song",
        dataType: "text",
        async: false,
        success: function (response) {
            $result = response;
        }
    });
    return $result == "OK";
}

/* Play functions */
/**
 * plays all songs inside the album
 * @param album
 * @param artist
 * @param all specifies whether to play all the artist songs or only those saved by the user
 */
function play_album(album, artist, all) {
    activate_player();
    play_pause();
    reset_queue();
    $.getJSON("./requests.php", "&username=" + username + "&type=" + (all ? "all_album_songs" : "user_album_songs") + "&album=" + album, function (json) {
        json.songs.forEach(function (item) {
            queue.push({
                'name': item.name, 'artist': artist, 'album': album
            });
        });
        if (shuffle) {
            shuffle_queue(queue);
        }
        play_next();
    });
}

/**
 * play all songs of an artist
 * @param artist
 * @param all specifies whether to play all the artist songs or only those saved by the user
 */
function play_artist(artist, all) {
    activate_player();
    play_pause();
    reset_queue();
    $.getJSON("./requests.php", "&username=" + username + "&type=" + (all ? "all_artist_songs" : "user_artist_songs") + "&artist=" + artist, function (json) {
        json.albums.forEach(function (album) {
            album.songs.forEach(function (item) {
                queue.push({
                    'name': item.songname, 'artist': artist, 'album': album.albumname
                });
            });
        });
        if (shuffle) {
            shuffle_queue(queue);
        }
        play_next();
    })
}

/**
 * play all song inside the user playlist
 * @param playlist
 */
function play_playlist(playlist) {
    activate_player();
    play_pause();
    reset_queue();
    $.getJSON("./requests.php", "&username=" + username + "&type=" + "songs_into_pl" + "&pl_name=" + playlist, function (json) {
        json.songs.forEach(function (item) {
            queue.push({
                'name': item.name, 'artist': item.artist, 'album': item.album
            });
        });
    });
    if (shuffle) {
        shuffle_queue(queue);
    }
    play_next();
}

/**
 * play all user saved songs
 */
function play_library() {
    activate_player();
    play_pause();
    reset_queue();
    $.getJSON("./requests.php", "&username=" + username + "&type=" + "user_songs", function (json) {
        json.songs.forEach(function (song) {
            queue.push({
                'name': song.name, 'artist': song.artist, 'album': song.album
            });
        });
        if (shuffle) {
            shuffle_queue(queue);
        }
        play_next();
    })
}

/**
 * function that plays the song if it's paused or pause a song if it's playing
 */
function play_pause() {
    const PAUSE_SVG = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" class="">' + '<path fill="none" d="M0 0h16v16H0z"></path><path d="M3 2h3v12H3zm7 0h3v12h-3z"></path></svg>');
    const PLAY_SVG = $.parseHTML('<svg height="16" width="16" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path></svg>');

    if (song.paused) {
        if (!$("#actual-song-name").text() == "") { // if a song has been played
            song.play();
            $(".playpause-button").empty().append(PAUSE_SVG);
        } else if (queue.length != 0) {
            play_next();
        }
    } else { // if a song is playing
        song.pause();
        $(".playpause-button").empty().append(PLAY_SVG);
    }
}

/**
 * play next song when possible
 */
function play_next() {
    const PLAY_SVG = $.parseHTML('<svg height="16" width="16" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path></svg>');

    song.pause();
    $(".playpause-button").empty().append(PLAY_SVG);
    if (repeat) {
        song.src = repeat_src;
        play_pause();
    } else if (queue.length > 0) {
        song.src = "../media/" + queue[0].artist + "/" + queue[0].album + "/" + queue[0].name + ".mp3";
        $("#actual-song-name").text(queue[0].name);
        $("#actual-artist").text(queue[0].artist);
        $(".cover-art .cover-art-image").show().attr("src", "../media/" + queue[0].artist + "/" + queue[0].album + "/cover.jpg");

        previous.push({
            'name': queue[0].name, 'artist': queue[0].artist, 'album': queue[0].album
        })
        queue.shift();
        play_pause();
    } else {
        $(".cover-art .cover-art-image").hide();
        $("#actual-song-name").text("");
        $("#actual-artist").text("");
    }
}

/**
 * play previous song when possible
 */
function play_previous() {
    const PLAY_SVG = $.parseHTML('<svg height="16" width="16" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path></svg>');

    song.pause();
    $(".playpause-button").empty().append(PLAY_SVG);
    if (previous.length > 0) {
        prev = previous.pop();
        queue.unshift({
            'name': queue[0].name, 'artist': queue[0].artist, 'album': queue[0].album
        })
        song.src = "../media/" + prev.artist + "/" + prev.album + "/" + prev.name + ".mp3";
        $("#actual-song-name").text(prev.name);
        $("#actual-artist").text(prev.artist);
        $(".cover-art .cover-art-image").show().attr("src", "../media/" + queue[0].artist + "/" + queue[0].album + "/cover.jpg");

        play_pause();
    } else {
        $(".cover-art .cover-art-image").hide();
        $("#actual-song-name").text("");
        $("#actual-artist").text("");
    }
}

/**
 * play the specified song
 * @param songname
 * @param songartist
 * @param songalbum
 */
function play_this(songname, songartist, songalbum) {
    const PAUSE_SVG = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" class="">' + '<path fill="none" d="M0 0h16v16H0z"></path><path d="M3 2h3v12H3zm7 0h3v12h-3z"></path></svg>');

    newsrc = "../media/" + songartist + "/" + songalbum + "/" + songname + ".mp3";
    if (lastsong != newsrc) {
        if (check_remotely_exist(newsrc)) {
            lastsong = newsrc;
            song.src = newsrc;
            song.play();
            $("#actual-song-name").text(songname);
            $("#actual-artist").text(songartist);
            $(".cover-art .cover-art-image").show().attr("src", "../media/" + songartist + "/" + songalbum + "/cover.jpg");
            $(".playpause-button").empty().append(PAUSE_SVG);
            activate_player();
        } else {
            // nothing
        }
    } else {
        song.currentTime = 0;
    }
};
