<?php
session_start();
if (isset($_SESSION['username'])) {
    ?>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../css/home.css">
        <link rel="icon" href="../img/Musify_favicon_green.png">
        <script src="https://code.jquery.com/jquery-3.5.1.js"
                integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=" crossorigin="anonymous"></script>
        <title>Home - Musify</title>
    </head>

    <body>
    <div id="main">
        <div class="main-grid-container">
            <div class="main-topbar">
                <header class="main-topbar-header">
                    <!-- home -->
                    <div class="topbar-wrapper">
                        <div class="topbar-content">
                            <div class="topbar-content-search">
                                <form>
                                    <input class="search-input text-format-14" maxlength="800"
                                           placeholder="Artisti, brani o playlist">
                                </form>
                                <div class="search-inside">
                                <span class="search-inside-span">
                                    <svg height="24px"
                                         width="24px"
                                         viewBox="0 0 24 24">
                                        <path d="M16.387 16.623A8.47 8.47 0 0019 10.5a8.5 8.5 0 10-8.5 8.5 8.454 8.454 0 005.125-1.73l4.401 5.153.76-.649-4.399-5.151zM10.5 18C6.364 18 3 14.636 3 10.5S6.364 3 10.5 3 18 6.364 18 10.5 14.636 18 10.5 18z"></path>
                                    </svg>
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button class="profile-button" type="button">
                        <figure class="profile-button-avatar" title="Agostino Messina">
                            <img draggable="false"
                                 src="https://cdn.motor1.com/images/mgl/pElZo/s1/4x3/tequila-lanciafiamme-e-tavole-da-surf-tutte-le-pazzie-di-elon-musk.webp"
                                 alt="Agostino Messina" class="image profile-avatar-img">
                        </figure>
                        <span class="user-widget-name list-item-title1"
                              data-testid="user-widget-name"><?= ucwords($_SESSION['username']) ?></span>
                        <svg height="16" width="16" class="user-widget-svg"
                             viewBox="0 0 16 16">
                            <path class="user-widget-svg" d="M3 6l5 5.794L13 6z"></path>
                        </svg>
                    </button>

                    <div class="user-settings-widget">
                        <ul tabindex="0" data-depth="0" class="user-settings-list">
                            <li>
                                <button class="transparent-button">
                                    <span class="text-format-14">Esci</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </header>
            </div>
            <nav class="main-left-navbar">
                <div class="main-navbar-wrapper">

                    <a class="banner-logo-link" draggable="false" href="home.php">
                        <img src="../img/Musify_small_white.png" alt="Musify logo" class="musiify-logo-img"
                             draggable="false">
                    </a>
                    <ul class="navbar-sections">
                        <li class="navbar-list-item">
                            <div id="home" class="link-section link-section-active">
                                <svg height="24" width="24" class="home-icon"
                                     viewBox="0 0 24 24">
                                    <path d="M9 14h6v7h5V7.8l-8-4.6-8 4.6V21h5v-7zm1 8H3V7.2L12 2l9 5.2V22h-7v-7h-4v7z"></path>
                                </svg>
                                <svg height="24" width="24" class="home-active-icon"
                                     viewBox="0 0 24 24">
                                    <path d="M21 22V7.174l-9.001-5.195L3 7.214V22h7v-7h4v7z"></path>
                                </svg>
                                <span class="list-item-title">Home</span>
                            </div>
                        </li>

                        <li class="navbar-list-item">
                            <div id="library" class="link-section">
                                <svg height="24" width="24"
                                     class="collection-icon" viewBox="0 0 24 24">
                                    <path d="M13.66 4.097l-.913.406 7.797 17.513.914-.406L13.66 4.097zM3 22h1V4H3v18zm6 0h1V4H9v18z"></path>
                                </svg>
                                <svg height="24" width="24"
                                     class="collection-active-icon" viewBox="0 0 24 24">
                                    <path d="M14.617 3.893l-1.827.814 7.797 17.513 1.827-.813-7.797-17.514zM3 22h2V4H3v18zm5 0h2V4H8v18z"></path>
                                </svg>
                                <span class="list-item-title">La tua libreria</span>
                            </div>
                        </li>
                    </ul>

                    <div class="navbar-playlist">
                        <hr>
                        <button class="create-playlist-button navbar-playlist-item">
                            <div class="create-playlist-button-border">
                                <div class="create-playlist-button-image">
                                    <svg height="12" width="12" viewBox="0 0 16 16">
                                        <path d="M14 7H9V2H7v5H2v2h5v5h2V9h5z"></path>
                                        <path fill="none" d="M0 0h16v16H0z"></path>
                                    </svg>
                                </div>
                            </div>
                            <span class="list-item-title">Crea playlist</span>
                        </button>

                        <div id="saved-songs" class="saved-songs-link navbar-playlist-item">
                            <div class="saved-songs-button-border">
                                <div class="saved-songs-button-image">
                                    <svg height="12" width="12" viewBox="0 0 16 16">
                                        <path fill="none" d="M0 0h16v16H0z"></path>
                                        <path d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"></path>
                                    </svg>
                                </div>
                            </div>
                            <span class="span-opacity list-item-title">Brani preferiti</span>
                        </div>
                        <div id="user-playlist"></div>
                    </div>
                </div>
            </nav>

            <div class="main-bottom-playingbar">
                <footer class="now-playingbar">
                    <div class="now-playingbar-container">
                        <div class="now-playingbar-firstcolumn">
                            <div class="now-playing-widget">
                                <div class="now-playing-cover">
                                    <a draggable="false"
                                       href="/user/11141439451/collection?uid=374a02cc64fc337b795c&amp;uri=spotify%3Atrack%3A5XAPpyIoYF3QXP34Hv8Pvx"
                                       style="border: none;">

                                        <div class="cover-art shadow"
                                             style="width: 56px; height: 56px;">
                                            <div class="icon">
                                                <svg width="80" height="81" viewBox="0 0 80 81"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <title>Playlist Icon</title>
                                                    <path d="M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z"
                                                          fill="currentColor" fill-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <img draggable="false"
                                                 src="https://i.scdn.co/image/ab67616d00004851dcff3103179d992594a227db"
                                                 alt=""
                                                 class="image cover-art-image">
                                        </div>
                                    </a>
                                </div>
                                <div class="now-playing-song-info">
                                    <div class="song-info-title text-format-14"
                                         data-testid="context-item-info-title" dir="auto">
                                    <span draggable="true">
                                        <a draggable="false" id="actual-song-name"
                                           href="/album/2VrpzWjnsiELWKXOJAFhme"></a>
                                    </span>
                                    </div>
                                    <div class="song-info-artist text-format-11">
                                    <span draggable="true">
                                        <a draggable="false" href="/artist/1VPmR4DJC1PlOtd0IADAO0"
                                           id="actual-artist"></a>
                                    </span>
                                    </div>
                                </div>
                                <button id="save-song-button" class="control-button save-song-button-green">
                                    <svg height="16" width="16" viewBox="0 0 16 16">
                                        <path fill="none" d="M0 0h16v16H0z"></path>
                                        <path d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="now-playingbar-secondcolumn">
                            <div class="player-controls">
                                <div class="player-controls-buttons">
                                    <div class="player-controls-left">
                                        <button class="shuffle-button shuffle-button-active">
                                            <svg height="16" width="16" viewBox="0 0 16 16"
                                                 class="">
                                                <path d="M4.5 6.8l.7-.8C4.1 4.7 2.5 4 .9 4v1c1.3 0 2.6.6 3.5 1.6l.1.2zm7.5 4.7c-1.2 0-2.3-.5-3.2-1.3l-.6.8c1 1 2.4 1.5 3.8 1.5V14l3.5-2-3.5-2v1.5zm0-6V7l3.5-2L12 3v1.5c-1.6 0-3.2.7-4.2 2l-3.4 3.9c-.9 1-2.2 1.6-3.5 1.6v1c1.6 0 3.2-.7 4.2-2l3.4-3.9c.9-1 2.2-1.6 3.5-1.6z"></path>
                                            </svg>
                                        </button>
                                        <button class="backwards-button" disabled>
                                            <svg height="16" width="16" viewBox="0 0 16 16">
                                                <path d="M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    <button class="playpause-button transition-button" disabled>
                                        <svg height="16" width="16" viewBox="0 0 16 16"
                                             class="">
                                            <path d="M4.018 14L14.41 8 4.018 2z"></path>
                                        </svg>
                                    </button>

                                    <div class="player-controls-right">
                                        <button class="forwards-button" disabled>
                                            <svg height="16" width="16" viewBox="0 0 16 16">
                                                <path d="M11 3v4.119L3 2.5v11l8-4.619V13h2V3z"></path>
                                            </svg>
                                        </button>
                                        <button class="repeat-button">
                                            <svg height="16" width="16" viewBox="0 0 16 16">
                                                <path d="M5.5 5H10v1.5l3.5-2-3.5-2V4H5.5C3 4 1 6 1 8.5c0 .6.1 1.2.4 1.8l.9-.5C2.1 9.4 2 9 2 8.5 2 6.6 3.6 5 5.5 5zm9.1 1.7l-.9.5c.2.4.3.8.3 1.3 0 1.9-1.6 3.5-3.5 3.5H6v-1.5l-3.5 2 3.5 2V13h4.5C13 13 15 11 15 8.5c0-.6-.1-1.2-.4-1.8z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div class="playback-bar">
                                    <div class="playback-time-elapsed text-format-11">
                                        1:50
                                    </div>
                                    <div class="range-input">
                                        <label class="hidden-visually">Modifica stato
                                            <input type="range" min="0" max="145" step="5"
                                                   value="110">
                                        </label>
                                        <div class="progress-bar"
                                             style="--progress-bar-transform:75.8621%;">
                                            <div class="progress-bar-background">
                                                <div class="progress-bar-container">
                                                    <div class="progress-bar-bar"></div>
                                                </div>
                                                <div class="progress-bar-final-circle"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="playback-duration text-format-11">2:25</div>
                                </div>
                            </div>
                        </div>

                        <div class="now-playingbar-thirdcolumn">
                            <div class="extra-controls">
                                <button class="queue-control control-button">
                                    <svg height="16" width="16" viewBox="0 0 16 16">
                                        <path d="M2 2v5l4.33-2.5L2 2zm0 12h14v-1H2v1zm0-4h14V9H2v1zm7-5v1h7V5H9z"></path>
                                    </svg>
                                </button>
                                <div class="volume-bar">
                                    <button class="volume-bar-icon-button control-button">
                                        <svg height="16" width="16" id="volume-icon" viewBox="0 0 16 16">
                                            <path d="M10.04 5.984l.658-.77q.548.548.858 1.278.31.73.31 1.54 0 .54-.144 1.055-.143.516-.4.957-.259.44-.624.805l-.658-.77q.825-.865.825-2.047 0-1.183-.825-2.048zM0 11.032v-6h2.802l5.198-3v12l-5.198-3H0zm7 1.27v-8.54l-3.929 2.27H1v4h2.071L7 12.302z"></path>
                                        </svg>
                                    </button>
                                    <div class="range-input">
                                        <label class="hidden-visually">Modifica volume
                                            <input type="range" min="0" max="1" step="0.1"
                                                   value="0.3225806451612903">
                                        </label>
                                        <div class="progress-bar" style="--progress-bar-transform:32.2581%;">
                                            <div class="progress-bar-background">
                                                <div class="progress-bar-container">
                                                    <div class="progress-bar-bar"></div>
                                                </div>
                                                <div class="progress-bar-final-circle"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <div class="main-central-view">
                <div class="create-playlist-widget">
                    <form action="javascript:void(0);">
                        <label for="playlist-name" class="playlist-name-label">
                            Crea nuova playlist
                        </label>
                        <span class="create-playlist-close-widget">&#10006;</span>
                        <input type="text" class="form-control" id="playlist-name" placeholder="Nome playlist"
                               required maxlength="20" autocomplete="off">
                        <label id="error-playlist-name" class="control-label-validation"
                               for="playlist-name">Errore</label>
                        <input type="submit" id="create-playlist-widget-button" class="transparent-button" value="Crea">
                    </form>
                </div>

                <main class="main-view-container">

                </main>
            </div>
        </div>
    </div>
    </body>
    <script src="../js/home.js" type="text/javascript"></script>

    </html>
    <?php
} else {
    header("Location: ../index.php");
}
?>
