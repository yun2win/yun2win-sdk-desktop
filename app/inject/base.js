function login(){
    var wrapper = document.getElementById('j-wrapper');
    if (wrapper) {
        wrapper.style['-webkit-user-select'] = 'none';
        wrapper.style['-webkit-app-region'] = 'drag';
    }
}

function main() {
    var title = document.getElementsByClassName('title')[0];
    var logo = document.getElementsByClassName('logo')[0];
    var chatBar = document.getElementById('chatName');


    if (title && logo) {
        title.removeChild(logo);
    }
    if (title) {
        title.style['-webkit-user-select'] = 'none';
        title.style['-webkit-app-region'] = 'drag';
    }
    if (chatBar) {
        chatBar.style['-webkit-app-region'] = 'drag';
    }
}



login();
main();