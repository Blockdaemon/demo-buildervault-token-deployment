import { createEIP1193Provider } from '@blockdaemon/buildervault-web3-provider';
import { createWalletClient, createPublicClient, custom, http, toHex, formatEther, parseEther } from 'viem'
import { anvil } from 'viem/chains'
import { BlockdaemonERC1404 } from './BlockdaemonERC1404.ts'

async function main() {

  // Create BuilderVault Web3 Provider with clients for each MPC TSM node player
  const eip1193Provider = await createEIP1193Provider({
    chains: [{
      chainName: anvil.name,
      chainId: toHex(anvil.id),
      rpcUrls: [anvil.rpcUrls.default.http[0]],
    }],
    playerCount: 2,
    player0Url: "https://tsm-sandbox.prd.wallet.blockdaemon.app:8080",  // BuilderVault MPC TSM Node 1 - hosts key share 1 in Nitro enclave
    player1Url: "https://tsm-sandbox.prd.wallet.blockdaemon.app:8081",  // BuilderVault MPC TSM Node 2 - hosts key share 2 in Nitro enclave
    player0MPCpublicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEtDFBfanInAMHNKKDG2RW/DiSnYeI7scVvfHIwUIRdbPH0gBrsilqxlvsKZTakN8om/Psc6igO+224X8T0J9eMg==",
    player1MPCpublicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqvSkhonTeNhlETse8v3X7g4p100EW9xIqg4aRpD8yDXgB0UYjhd+gFtOCsRT2lRhuqNForqqC+YnBsJeZ4ANxg==",
    player0mTLSpublicKey: "-----BEGIN CERTIFICATE-----\nMIICMjCCAdegAwIBAgICB+MwCgYIKoZIzj0EAwIwgaAxCzAJBgNVBAYTAlVTMRMw\nEQYDVQQIDApDYWxpZm9ybmlhMRQwEgYDVQQHDAtMb3MgQW5nZWxlczEUMBIGA1UE\nCgwLQmxvY2tkYWVtb24xFDASBgNVBAsMC0Jsb2NrZGFlbW9uMRQwEgYDVQQDDAtC\nbG9ja2RhZW1vbjEkMCIGCSqGSIb3DQEJARYVYWRtaW5AYmxvY2tkYWVtb24uY29t\nMB4XDTI0MTIxMDE0MjQyOVoXDTI5MTIxMDE0MjQyOVowTjELMAkGA1UEBhMCVVMx\nEzARBgNVBAgTCkNhbGlmb3JuaWExFDASBgNVBAcTC0xvcyBBbmdlbGVzMRQwEgYD\nVQQKEwtCbG9ja2RhZW1vbjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABFyD6P8s\n/asEB/7ERpHxye5cpZXXtRYh299ioHemPdKzpmmYqyKqv4G7leXT4bZsAPwqzG3+\nQRg/8HPJA9a8hW2jUjBQMA4GA1UdDwEB/wQEAwIHgDAdBgNVHSUEFjAUBggrBgEF\nBQcDAgYIKwYBBQUHAwEwHwYDVR0jBBgwFoAUW6ouasv5oWo7MZ4ZzlE/mpbDrIMw\nCgYIKoZIzj0EAwIDSQAwRgIhAJZZITPjl9cZNrM1TPRtYo6+TQZw/Q1SO+3xZ5T5\nedeeAiEAlpVDC79W6ym30J6f3gSvOQOJO30+AsJs8gQycf8KK2A=\n-----END CERTIFICATE-----",
    player1mTLSpublicKey: "-----BEGIN CERTIFICATE-----\nMIICMDCCAdegAwIBAgICB+MwCgYIKoZIzj0EAwIwgaAxCzAJBgNVBAYTAlVTMRMw\nEQYDVQQIDApDYWxpZm9ybmlhMRQwEgYDVQQHDAtMb3MgQW5nZWxlczEUMBIGA1UE\nCgwLQmxvY2tkYWVtb24xFDASBgNVBAsMC0Jsb2NrZGFlbW9uMRQwEgYDVQQDDAtC\nbG9ja2RhZW1vbjEkMCIGCSqGSIb3DQEJARYVYWRtaW5AYmxvY2tkYWVtb24uY29t\nMB4XDTI0MTIxMDE0MjQ0OVoXDTI5MTIxMDE0MjQ0OVowTjELMAkGA1UEBhMCVVMx\nEzARBgNVBAgTCkNhbGlmb3JuaWExFDASBgNVBAcTC0xvcyBBbmdlbGVzMRQwEgYD\nVQQKEwtCbG9ja2RhZW1vbjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABDm0QCLd\nOUS/P7tR6mmbUD9CL/qTgRTu76U3oIB5QYGj7lDHo8ngnBknVRoz9q+vsk3HvLXK\nAFAcIHsiYQjPJvujUjBQMA4GA1UdDwEB/wQEAwIHgDAdBgNVHSUEFjAUBggrBgEF\nBQcDAgYIKwYBBQUHAwEwHwYDVR0jBBgwFoAUW6ouasv5oWo7MZ4ZzlE/mpbDrIMw\nCgYIKoZIzj0EAwIDRwAwRAIgVjSlH7sjQ1yus/A2J4mUh3gGljPQaip7ud4ctxdv\n5hUCIG4gazgsH8T0MOdUFdpJovjcxv2KoMl+xQZmYy/G9Pyb\n-----END CERTIFICATE-----",
    player0ClientCert: "./client.crt",
    player0ClientKey: "./client.key",
    player1ClientCert: "./client.crt",
    player1ClientKey: "./client.key",
    masterKeyId: process.env.MASTERKEY,
    accountId: 0,   // account of BIP44 m/44/60/account/0/address_index
    addressIndex: 0, // address_index of BIP44 m/44/60/account/0/address_index
  })

  // Create public client for Anvil chain (reads from local Anvil instance)
  const publicClient = createPublicClient({
    chain: anvil,
    transport: http(),
  })

  // Create wallet client for broadcast operations to Anvil chain using BuilderVault Web3 Provider for signing operations
  const walletClient = createWalletClient({ 
    chain: anvil,
    transport: custom({
      async request({ method, params }) {
        const response = await eip1193Provider.request({method, params})
        return response
      }
    })
  })
  if (!walletClient.getChainId) {
    throw new Error("Wallet not connected");
  }

  // Request wallet addresses from Web3 Provider derived from Buidler Vault MPC public key
  const addresses: `0x${string}`[] = await walletClient.requestAddresses();

  // Fund first wallet address using anvil RPC custom method "anvil_setBalance"
  const response = await fetch(anvil.rpcUrls.default.http[0], {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      method: 'anvil_setBalance',
      params: [addresses[0], "0x11c37937e08000"],
      jsonrpc: '2.0',
      id: 1
    })
  });
  if (!response.ok) {
    throw new Error("Failed to fund wallet");
  }
 
  // Check balance of first wallet address
  let balance = await publicClient.getBalance({
    address: addresses[0],
  })
  console.log(`Wallet address ${addresses[0]} balance: ${balance} ETH`)

  // =============================================
  // ======== DEPLOY AND MINT ERC1404 CONTRACT ===
  // =============================================

  console.log(`Deploying ERC1404 token contract bytecode...`)

  // Broadcast deployment of token contract txn
  let hash = await walletClient.deployContract({
    abi: BlockdaemonERC1404.abi,
    account: addresses[0],
    bytecode: BlockdaemonERC1404.bytecode,
  })
  await publicClient.waitForTransactionReceipt({ hash: hash});

  // Get deployed contract address
  let deployedContractAddress = (await publicClient.waitForTransactionReceipt({ hash: hash,})).logs[0].address
  console.log(`Deployed token contract address: ${deployedContractAddress}`)


  // =========================================
  // ======== MINT ERC1404 FROM EOA ======
  // =========================================

  console.log(`\nMinting 99 ERC1404 tokens to recipient wallet address: 0x0000000000000000000000000000000000000001...`)

  // Send ERC1404 mint() call to contract
  hash = await walletClient.writeContract({
    abi: BlockdaemonERC1404.abi,
    account: addresses[0],
    address: deployedContractAddress,
    functionName: 'mint',
    args: ['0x0000000000000000000000000000000000000001', parseEther('99')]
  })
  await publicClient.waitForTransactionReceipt({ hash: hash});


  // Log ERC20 Balance of recipeint
  console.log(`Recipient address 0x0000000000000000000000000000000000000001 balance after mint: ${formatEther(await publicClient.readContract({
    abi: BlockdaemonERC1404.abi,
    functionName: 'balanceOf',
    address: deployedContractAddress,
    args: ['0x0000000000000000000000000000000000000001'],
  }))} ERC1404`);

}

main();