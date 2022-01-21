/*
@Agostino

This file contains all the function to set up the home view and update it based on the interaction with the user

 */

// Global variables
var username = $.trim($('.user-widget-name').text());
var song = new Audio();
var queue = [];
var previous = [];
var lastsong;
var pause_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" class="">' + '<path fill="none" d="M0 0h16v16H0z"></path><path d="M3 2h3v12H3zm7 0h3v12h-3z"></path></svg>');
var play_svg = $.parseHTML('<svg height="16" width="16" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path></svg>');
var shuffle = false;
var repeat = false;
var repeat_src = " ";

$(document).ready(function () {
    fill_side_playlists();
    show_homepage();
});

//function that fills all the playlists in the left navbar
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
            }).appendTo($wrapper);
        });
    });
}

function show_homepage() {
    $(".main-view-container").empty();
    $("#saved-songs").children().removeClass("active-playlist");
    $("#library").removeClass("link-section-active");
    $("#home").addClass("link-section-active");
    show_default_top_header()

    const artists_section = $.parseHTML('<div class="main-view-container-top-spacer"></div>' + '<div class="main-view-grid-template" style="--minimumColumnWidth:180px;">' + '<div class="grid-column-template">' + '<section class="top-artists">' + '<div class="top-artists-title">' + '<h2 class="section-title-h2">Gli artisti top</h2></div>' + '<div class="top-artists-section"><div class="scroll-wrapper">' + '<div class="main-view-grid-template homepage-grid-content-disposition">' + '<div class="next-button-area">' + '<button title="Avanti" class="next-button">' + '<div class="next-button-border-area">' + '<span class="next-button-span">' + '<svg height="24" width="24" viewBox="0 0 24 24" class="">' + '<path d="M7.96 21.151l-.649-.761 9.554-8.161-9.554-8.16.649-.76 10.445 8.92z">' + '</path></svg></span></div></button></div>' + '<div class="prev-button-area">' + '<button title="Avanti" class="next-button">' + '<div class="next-button-border-area">' + '<span class="prev-button-span">' + '<svg height="24" width="24" viewBox="0 0 24 24" class="">' + '<path d="M7.96 21.151l-.649-.761 9.554-8.161-9.554-8.16.649-.76 10.445 8.92z">' + '</path></svg></span></div></button></div>');
    $(".main-view-container").append(artists_section);

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
            }).appendTo(".main-view-grid-template .homepage-grid-content-disposition");
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
                'class': 'browse-all-song-save-button', 'append': $not_saved_button_svg
            });

            if (song_already_owned(item.name) != "OK") {
                $save_button.empty().append($saved_button_svg);
                $save_button.click(function () {
                    remove_this_from_library(item.name)
                });
            } else {
                $save_button.click(function () {
                    if (add_song_to_library(item.name)) {
                        $(this).empty().append($saved_button_svg);
                    }
                })
            }

            $cover = $('<img>', {
                'draggable': 'false',
                'src': '../media/' + item.artist + '/' + item.album + '/cover.jpg',
                'alt': '',
                'class': 'image single-browse-all-image',
            });

            $h3 = $('<h3>', {'class': 'single-browse-all-h3', 'html': item.name});

            $h4 = $('<h4>', {'class': 'single-browse-all-h4', 'html': item.artist});

            $('<div>', {
                'class': 'single-browse-all-link', 'style': 'background-color: rgb(' + x + ', ' + y + ', ' + z + ')',
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
                }).appendTo(".browse-all .main-view-grid-template");
        });
    });

// todo scroll to right when next-button is clicked
    $(".next-button", artists_section).click(function () {
        console.log("scroll");
        var leftPos = $('.top-artists-section').scrollLeft();
        console.log(leftPos);
        $(".top-artists-section").animate({scrollLeft: leftPos + 200}, 800);
    });

}

function song_already_owned($songname) {
    $result = "";
    $.ajax({
        type: "GET",
        url: "./requests.php",
        data: "username=" + username + "&songname=" + $songname + "&type=check_owned_song",
        dataType: "text",
        async: false,
        success: function (response) {
            $result = response;
        }
    });
    return $result;
}

function add_song_to_library($songname) {
    $.get("./requests.php", "type=add_song_to_lib&username=" + username + "&songname=" + $songname, function (data) {
        console.log('adding');
        if (data == "OK") {
            // $($div).empty().append($saved_button_svg);
            return true;

        } else {
            // $($div).empty().append($not_saved_button_svg);
            return false;
        }
    });
}

function show_default_top_header() {
    const html = $.parseHTML('<div class="topbar-content"><div class="topbar-content-search"><form><input class="search-input text-format-14" maxlength="800" placeholder="Artisti, brani o playlist"></form><div class="search-inside"><span class="search-inside-span"><svg height="24" width="24" viewBox="0 0 24 24"><path d="M16.387 16.623A8.47 8.47 0 0019 10.5a8.5 8.5 0 10-8.5 8.5 8.454 8.454 0 005.125-1.73l4.401 5.153.76-.649-4.399-5.151zM10.5 18C6.364 18 3 14.636 3 10.5S6.364 3 10.5 3 18 6.364 18 10.5 14.636 18 10.5 18z"></path></svg></span></div></div></div>');
    $(".main-topbar-header .topbar-wrapper").empty().append(html);
}

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

function show_empty_section(item) {
    var $wrapper = $('<div>', {'class': 'empty_section'}).appendTo(".main-view-container");
    $wrapper.append($('<div>', {
        'class': 'empty-section-message', 'html': $('<div>', {
            'html': 'Non ci sono ' + item + ' nella tua libreria, esplora per aggiungere dei contenuti'
        }), 'append': $('<div>', {'class': 'empty_section_explore_btn', 'html': 'Esplora'}).click(show_homepage),
    }))
}

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
                'html': json.albums[0].genre + ' - ' + (json.nsongs == 1 ? json.nsongs + ' brano' : json.nsongs + ' brani')
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

        json.albums.forEach(function (item) {

            let i = 1;
            item.songs.forEach(function (song) {
                $number = $('<div>', {
                    'class': 'song-number',
                    'prepend': $('<span>', {'class': '', 'html': i}),
                    'append': $('<button>', {
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

                if (song_already_owned(song.songname) != "OK") {
                    $save_button.addClass('control-button-active');
                    $save_button.click(function () {
                        remove_this_from_library(song.songname);
                        $save_button.removeClass('control-button-active');
                    })
                } else {
                    $save_button.click(function () {
                        add_song_to_library(song.songname);
                        $save_button.addClass('control-button-active');
                    })
                }

                $('<div>', {
                    'class': 'row-song', 'prepend': $number, 'append': $song_image
                }).append($album_info)
                    .append($save_button)
                    .append($duration_info)
                    .on("mouseover mouseout", function (event) {
                        switch (event.type) {
                            case "mouseover":
                                $(this).children().children(".song-play-button").show();
                                $(this).children('.song-number').children("span").hide();
                                break;
                            case "mouseout":
                                $(this).children().children(".song-play-button").hide();
                                $(this).children('.song-number').children("span").show();
                                break;
                        }
                    }).appendTo('.content-songs');
                i++;
            })

        });
    });
}

function show_this_album(album, artist, all) {
    $(".main-view-container").empty();
    $.getJSON("./requests.php", "username=" + username + "&album=" + album + "&type=" + ((all) ? "all_album_songs" : "user_album_songs"), function (json) {
        console.log(json);
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
                'html': json.genre + ' - ' + (json.nsongs == 1 ? json.nsongs + ' brano' : json.nsongs + ' brani')
            }))
        })

        $play_button_svg = $.parseHTML('<svg height="28" width="28" viewBox="0 0 16 16" class="">' + '<path d="M4.018 14L14.41 8 4.018 2z"></path>' + '</svg>');

        $play_button = $('<button>', {
            'class': 'playlist-play-button transition-button', 'append': $play_button_svg
        }).click(function (e) {
            play_this_artist();
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
                'class': 'song-number',
                'prepend': $('<span>', {'class': '', 'html': i}),
                'append': $('<button>', {
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

            if (song_already_owned(song.name) != "OK") {
                $save_button.addClass('control-button-active');
                $save_button.click(function () {
                    remove_this_from_library(song.name);
                    $save_button.removeClass('control-button-active');
                })
            } else {
                $save_button.click(function () {
                    add_song_to_library(song.name);
                    $save_button.addClass('control-button-active');
                })
            }

            $('<div>', {
                'class': 'row-song', 'prepend': $number, 'append': $song_image
            }).append($album_info)
                .append($save_button)
                .append($duration_info)
                .on("mouseover mouseout", function (event) {
                    switch (event.type) {
                        case "mouseover":
                            $(this).children().children(".song-play-button").show();
                            $(this).children('.song-number').children("span").hide();
                            break;
                        case "mouseout":
                            $(this).children().children(".song-play-button").hide();
                            $(this).children('.song-number').children("span").show();
                            break;
                    }
                })
                .appendTo('.content-songs');

            i++;
        });
    });
}

function show_this_pl(playlist) {
    $(".main-view-container").empty();
    $("#saved-songs").children().removeClass("active-playlist");
    $("#home").removeClass("link-section-active");
    $("#library").removeClass("link-section-active");
    $("#user-playlist").children().children().removeClass("active-playlist");
    $("#" + this.id).children().addClass("active-playlist");

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
                'class': 'song-number',
                'prepend': $('<span>', {'class': '', 'html': i}),
                'append': $('<button>', {
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

            if (song_already_owned(song.name) != "OK") {
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
                .on("mouseover mouseout", function (event) {
                    switch (event.type) {
                        case "mouseover":
                            $(this).children().children(".song-play-button").show();
                            $(this).children('.song-number').children("span").hide();
                            break;
                        case "mouseout":
                            $(this).children().children(".song-play-button").hide();
                            $(this).children('.song-number').children("span").show();
                            break;
                    }
                })
                .appendTo('.content-songs');

            i++;
        });

    });
}

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
                play_this_pl();
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
            json.songs.forEach(function (item) {
                $number = $('<div>', {
                    'class': 'song-number',
                    'prepend': $('<span>', {'class': '', 'html': i}),
                    'append': $('<button>', {'class': 'song-play-button'}),
                });
                $song_image = $('<div>', {
                    'class': 'song-title', 'prepend': $('<img>', {
                        'class': 'row-song-image', 'src': '../media/' + item.artist + '/' + item.album + '/cover.jpg'
                    }), 'append': $('<div>', {
                        'class': 'song-info',
                        'prepend': $('<span>', {'class': 'title', 'html': item.name}),
                        'append': $('<span>', {'class': 'artist', 'html': item.artist}),
                    })
                });
                $album_info = $('<div>', {
                    'class': 'album-title', 'html': item.album
                });
                $duration_info = $('<div>', {
                    'class': 'album-title', 'html': item.length.split("00:").pop()
                });
                $saved_button_svg = $.parseHTML('<svg role="img" height="16" width="16" viewBox="0 0 16 16" >' + '<path fill="none" d="M0 0h16v16H0z"></path>' + '<path d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"></path>' + '</svg>');

                $save_button = $('<span>', {
                    'class': 'control-button-active', 'append': $saved_button_svg
                }).click(function () {
                    remove_this_from_library(item.name);
                    show_songs();
                });
                $('<div>', {
                    'class': 'row-song', 'prepend': $number, 'append': $song_image
                }).append($album_info).append($save_button).append($duration_info).appendTo('.content-songs');

                i++;
            });
        } else {
            show_empty_section('brani');
        }
    });
}

//function that check if the name of the playlist is already used
function check_valid_playlist_name() {
    return $.get("./requests.php", "username=" + username + "&type=check_pl_exist&new_pl_name=" + $('#playlist-name').val());
}

//the form in the create playlist widget creates a new playlist
$(".create-playlist-widget form").submit(function () {
    check_valid_playlist_name().done(function (data) {
        if (data === "OK") {
            $('#error-playlist-name').hide();
            $('#playlist-name').removeClass("invalid");
            $.get("./requests.php", "username=" + username + "&type=insert_new_pl&pl_name=" + $('#playlist-name').val(), function (data) {
                if (data === "ok") {
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

//button in the upper right that open the user's settings
$(".profile-button").on("click", function () {
    $(".profile-button svg").toggleClass("rotate");
    $(".user-settings-widget").toggle();
});

//closes the user-settings-widget when the user clicks outside
$("body").click(function (e) {
    console.log(e.target.className);
    if (e.target.className !== "profile-button") {
        $(".user-settings-widget").hide();
        $(".profile-button svg").removeClass("rotate");
    }
});

$(".create-playlist-close-widget").click(function (e) {
    $(".create-playlist-widget").fadeOut();
});

$("li > .transparent-button").click(function () {
    window.location.replace("../php/logout.php")
});

//button in the left navbar playlist that open the create playlist widget
$(".create-playlist-button").click(function () {
    $(".create-playlist-widget").fadeToggle();
});

$("#home").click(function () {
    $("#saved-songs").children().removeClass("active-playlist");
    $("#user-playlist").children().children().removeClass("active-playlist");
    show_homepage();
});

$("#library").click(function () {
    $("#saved-songs").children().removeClass("active-playlist");
    $("#user-playlist").children().children().removeClass("active-playlist");

    show_library_top_header();
    show_artists();
});

$("#saved-songs").click(function () {
    $("#saved-songs").children().addClass("active-playlist");
    $("#home").removeClass("link-section-active");
    $("#library").removeClass("link-section-active");
    $("#user-playlist").children().children().removeClass("active-playlist");

    show_songs();

});

function remove_this_from_library($songname) {
    $.get("./requests.php", "type=remove_from_library&username=" + username + "&songname=" + $songname, function (data) {
        if (data == "REMOVED") {
            //show_song_list();
        } else {
            console.log(data);
        }
    });
}

// Music playing functions
$('.playpause-button').click(play_pause);
$('.backwards-button').click(play_previous);
$('.forwards-button').click(play_next);
song.onended = function () {
    play_next();
};

function shuffle_queue(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function reset_queue() {
    $(".queue_list").addClass("no_queued_items");
    queue = [];
    previous = [];
}

function play_album($songalbum, $songartist) {
    $(".playpause-button").removeAttr('disabled');
    play_pause();
    reset_queue();
    $.getJSON("./requests.php", "&username=" + username + "&type=user_album_songs&album=" + $songalbum, function (json) {
        json.songs.forEach(function (item) {
            queue.push({
                'name': item.name, 'artist': $songartist, 'album': $songalbum
            });
        });
        if (shuffle) {
            shuffle_queue(queue);
        }
        play_next();
    });
}

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

// todo play_playlist
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

//todo play_library songs
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

function play_pause() {
    if (song.paused) {
        if (!$(".playpause-button").is(':disabled')) { // if a song has been played
            song.play();
            $(".playpause-button").empty().append(pause_svg);
        } else if (queue.length != 0) {
            play_next();
        }
    } else { // if a song is playing
        song.pause();
        $(".playpause-button").empty().append(play_svg);
    }
}

function play_next() {
    song.pause();
    $(".playpause-button").empty().append(play_svg);
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

function play_previous() {
    song.pause();
    $(".playpause-button").empty().append(play_svg);
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

function play_this(songname, songartist, songalbum) {
    newsrc = "../media/" + songartist + "/" + songalbum + "/" + songname + ".mp3";
    if (lastsong != newsrc) {
        if (check_remotely_exist(newsrc)) {
            lastsong = newsrc;
            song.src = newsrc;
            song.play();
            $("#actual-song-name").text(songname);
            $("#actual-artist").text(songartist);
            $(".cover-art .cover-art-image").show().attr("src", "../media/" + songartist + "/" + songalbum + "/cover.jpg");
            $(".playpause-button").empty().append(pause_svg);
            activate_player();
        } else {
            // nothing
        }
    } else {
        song.currentTime = 0;
    }
};

function activate_player() {
    $(".playpause-button").removeAttr('disabled');
    $(".forwards-button").removeAttr('disabled');
    $(".backwards-button").removeAttr('disabled');
}

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
