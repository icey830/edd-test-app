var gui = require('nw.gui');
var win = gui.Window.get();

var platform = require('./components/platform');
var updater = require('./components/updater');
var menus = require('./components/menus');
var settings = require('./components/settings');
var windowBehaviour = require('./components/window-behaviour');
var dispatcher = require('./components/dispatcher');

var mac_address = require('getmac');

mac_address.getMac(function(err, macAddress){
    if (err)  throw err
    $('#mac-address').html( macAddress );
});

// Ensure there's an app shortcut for toast notifications to work on Windows
if (platform.isWindows) {
  gui.App.createShortcut(process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\Starter.lnk");
}

// Add dispatcher events
dispatcher.addEventListener('win.alert', function(data) {
  data.win.window.alert(data.message);
});

dispatcher.addEventListener('win.confirm', function(data) {
  data.callback(data.win.window.confirm(data.message));
});

// Window state
windowBehaviour.restoreWindowState(win);
windowBehaviour.bindWindowStateEvents(win);

// Check for update
if (settings.checkUpdateOnLaunch) {
  updater.checkAndPrompt(gui.App.manifest, win);
}

// Run as menu bar app
if (settings.asMenuBarAppOSX) {
  win.setShowInTaskbar(false);
  menus.loadTrayIcon(win);
}

// Load the app menus
menus.loadMenuBar(win)
if (platform.isWindows) {
  menus.loadTrayIcon(win);
}

// Adjust the default behaviour of the main window
windowBehaviour.set(win);
windowBehaviour.setNewWinPolicy(win);

// Close the window using ESC key
windowBehaviour.closeWithEscKey(win);

// Add a context menu
menus.injectContextMenu(win, window, document);
    
// Reload the app periodically until it loads
var reloadIntervalId = setInterval(function() {
    
  if (win.window.navigator.onLine) {
    clearInterval(reloadIntervalId);
  } else {
    // win.reload();
    require('dns').resolve('www.google.com', function(err) {
        if (err){
            // no connection 
            console.log("No connection!");
            window.alert("There is no connection! Activation license need to connection!");
            win.close(true);
        }  
        else{
            // connection
            console.log("Connected!");
            //  window.alert("You're connected!");
        }  
    });
  }
}, 30 * 1000);


