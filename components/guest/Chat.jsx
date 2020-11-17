import React, {useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';

export default function Chat(props) {
    const [username, setUsername] = useState(props.route.params.item.user.username);
    const [title, setTitle] = useState(props.route.params.item.title);
    let msg =`Hello, i saw your post ${title}`;
    let encodedMsg = encodeURI(msg);

    return <WebView source={{uri: `https://bellefu.com/messenger?recipient=${username}&msg=${encodedMsg}`}} />;
}
