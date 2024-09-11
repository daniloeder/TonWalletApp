import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, Image, Alert } from 'react-native';
import TonConnect from '@tonconnect/sdk';

if (typeof window === 'undefined') {
  global.window = {};
}
if (typeof window.location === 'undefined') {
  window.location = { origin: 'http://localhost' };
}

const tonConnect = new TonConnect();

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [walletUrl, setWalletUrl] = useState(null);

  function parseUrlParams(url) {
    const startapp = new URLSearchParams(url.split('?')[1]).get('startapp');
    const formattedParams = decodeURIComponent(startapp.replace(/__/g, '=').replace(/--/g, '%'));
    const [preR, r] = formattedParams.split('-r=');

    const paramObj = preR.split('-').reduce((acc, component) => {
      const [key, value] = component.split('=');
      if (key && value) {
        acc[key === 'tonconnect' ? 'tonconnect-v' : key] = value;
      }
      return acc;
    }, {});

    if (r) {
      paramObj['r'] = encodeURIComponent(
        r.replace(/%22/g, '"').replace(/%7B/g, '{').replace(/%7D/g, '}').replace(/%2F/g, '/').replace(/%3A/g, ':').replace(/%2C/g, ',')
      );
    }
    // temp fix
    paramObj['r'] = `%7B%22manifestUrl%22%3A%22https%3A%2F%2Fraw.githubusercontent.com%2Fton-community%2Ftutorials%2Fmain%2F03-client%2Ftest%2Fpublic%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D`;

    return paramObj;
  }

  const connectWallet = async () => {
    try {
      const wallets = await tonConnect.getWallets();
      if (wallets.length > 0) {
        const walletInfo = wallets[0];
        const result = await tonConnect.connect(walletInfo);
        setWalletUrl(parseUrlParams(result))
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (walletUrl) {
    console.log(walletUrl);
    console.log(`tonkeeper://ton-connect?id=${walletUrl['id']}&r=${walletUrl['r']}&v=${walletUrl['v']}`)
  }

  const openUrl = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error('Failed to open URL:', err);
    }
  };

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Connect to a Wallet</Text>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl(`tonkeeper://ton-connect?id=${walletUrl['id']}&r=${walletUrl['r']}&v=${walletUrl['v']}`)}>
        <Image source={require('./assets/icons/tonkeeper.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>Tonkeeper</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl(`mytonwallet-tc://?id=${walletUrl['id']}&r=${walletUrl['r']}&v=${walletUrl['v']}`)}>
        <Image source={require('./assets/icons/mytonwallet.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>MyTonWallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl(`tonhub://connect/?id=${walletUrl['id']}&r=${walletUrl['r']}&v=${walletUrl['v']}`)}>
        <Image source={require('./assets/icons/tonhub.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>Tonhub</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl(`tg://resolve?id=${walletUrl['id']}&r=${walletUrl['r']}&v=${walletUrl['v']}`)}>
        <Image source={require('./assets/icons/telegram.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>Telegram</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl(`bitkeep://bkconnect/?id=${walletUrl['id']}&r=${walletUrl['r']}&v=${walletUrl['v']}`)}>
        <Image source={require('./assets/icons/bitgetwallet.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>Bitget Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl(`https://link.safepal.io/ton-connect?v=${walletUrl['v']}&id=${walletUrl['id']}&r=${walletUrl['r']}&ret=tg%3A%2F%2Fresolve`)}>
        <Image source={require('./assets/icons/safepal.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>SafePal</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl(`https://www.okx.com/download?appendQuery=true&deeplink=okx%3A%2F%2Fweb3%2Fwallet%2Ftonconnect&v=${walletUrl['v']}&id=${walletUrl['id']}&r=${walletUrl['r']}&ret=tg%3A%2F%2Fresolve`)}>
        <Image source={require('./assets/icons/okxwallet.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>OKX Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl(`https://tr.okx.com/download?appendQuery=true&deeplink=okxtr%3A%2F%2Fweb3%2Fwallet%2Ftonconnect&v=${walletUrl['v']}&id=${walletUrl['id']}&r=${walletUrl['r']}&ret=tg%3A%2F%2Fresolve`)}>
        <Image source={require('./assets/icons/okxtrwallet.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>OKX TR Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl(`https://app.bybit.com/ton-connect?v=${walletUrl['v']}&id=${walletUrl['id']}&r=${walletUrl['r']}&ret=tg%3A%2F%2Fresolve`)}>
        <Image source={require('./assets/icons/bybitwallet.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>Bybit Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TON Wallet App</Text>
      <TouchableOpacity style={styles.connectButton} onPress={connectWallet}>
        <Text style={styles.connectButtonText}>Connect to TON Wallet</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          {renderModalContent()}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#343a40',
  },
  connectButton: {
    backgroundColor: '#007bff',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#343a40',
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'flex-start',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  walletText: {
    fontSize: 16,
    color: '#343a40',
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#dc3545',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  closeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
