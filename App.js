import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import TonConnect from '@tonconnect/sdk';

if (typeof window === 'undefined') {
  global.window = {};
}
if (typeof window.location === 'undefined') {
  window.location = { origin: 'http://localhost' };
}

const tonConnect = new TonConnect();

export default function App() {
  const [wallet, setWallet] = useState(null);

  const connectWallet = async () => {
    try {
      const wallets = await tonConnect.getWallets();
      if (wallets.length > 0) {
        const walletInfo = wallets[0];
        const result = await tonConnect.connect(walletInfo);
        setWallet(result);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TON Wallet App</Text>
      {wallet ? (
        <Text>Connected to: {wallet.address}</Text>
      ) : (
        <Button title="Connect to TON Wallet" onPress={connectWallet} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});
