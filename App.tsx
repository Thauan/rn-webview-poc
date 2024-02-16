import React, {useRef} from 'react';
import {SafeAreaView, StatusBar, useColorScheme, View} from 'react-native';
import WebView from 'react-native-webview';

import {Colors} from 'react-native/Libraries/NewAppScreen';

export type NavigationState = {
  url?: string;
  title?: string;
  loading?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const webviewRef: any = useRef(null);

  const backgroundStyle: any = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: '100%',
  };

  const handleWebViewNavigationStateChange = (newNavState: NavigationState) => {
    const {url} = newNavState;
    console.log(newNavState);

    if (!url) {
      return;
    }

    // lidar com doctypes
    if (url.includes('.pdf')) {
      webviewRef.stopLoading();
    }

    // uma maneira de lidar com um envio de formulário bem-sucedido é por meio de strings de consulta
    if (url.includes('?message=success')) {
      webviewRef.stopLoading();
    }

    // uma maneira de lidar com erros é via string de consulta
    if (url.includes('?errors=true')) {
      webviewRef.stopLoading();
    }

    // redirecionar para outro lugar
    if (url.includes('google.com')) {
      const newURL = 'https://reactnative.dev/';
      const redirectTo = 'window.location = "' + newURL + '"';
      webviewRef.injectJavaScript(redirectTo);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          backgroundColor: 'red',
          height: '100%',
        }}>
        <WebView
          onOpenWindow={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            const {targetUrl} = nativeEvent;
            console.log('Intercepted OpenWindow for', targetUrl);
          }}
          javaScriptEnabled={true}
          onMessage={event => console.log(event, 'event')}
          sharedCookiesEnabled={true}
          injectedJavaScriptBeforeContentLoaded={`
            window.ReactNativeWebView.postMessage('Hello!');
            alert('carregou!!!');
          `}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          source={{
            uri: 'https://reactnative.dev/',
            headers: {
              Cookie: 'cookie1=asdf; cookie2=dfasdfdas',
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default App;
