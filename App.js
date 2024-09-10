import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, Image } from 'react-native';
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

  const connectWallet = async () => {
    try {
      const wallets = await tonConnect.getWallets();
      if (wallets.length > 0) {
        const walletInfo = wallets[0];
        const result = await tonConnect.connect(walletInfo);
        setWalletUrl(result);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

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
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl('tonkeeper://connect?url=' + encodeURIComponent(walletUrl))}>
        <Image source={require('./assets/icons/tonkeeper.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>Tonkeeper</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl('mytonwallet://connect?url=' + encodeURIComponent(walletUrl))}>
        <Image source={require('./assets/icons/mytonwallet.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>MyTonWallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl('tonhub://connect?url=' + encodeURIComponent(walletUrl))}>
        <Image source={require('./assets/icons/tonhub.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>Tonhub</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.walletButton} onPress={() => openUrl('tg://resolve?domain=wallet&start=connect&url=' + encodeURIComponent(walletUrl))}>
        <Image source={require('./assets/icons/telegram.jpeg')} style={styles.icon} />
        <Text style={styles.walletText}>Telegram</Text>
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
