import { TSMClient, Configuration, SessionConfig, curves } from "@sepior/tsmsdkv2";
import crypto from "crypto";

async function main() {
  // Create clients for each of the nodes

  const configs = [
    {
      url: "https://tsm-sandbox.prd.wallet.blockdaemon.app:8080", // BuilderVault MPC TSM Node 1 - hosts key share 1 in Nitro enclave
      clientCert: "./client.crt",
      clientKey: "./client.key",
      mTLSpublicKey: "-----BEGIN CERTIFICATE-----\nMIICMjCCAdegAwIBAgICB+MwCgYIKoZIzj0EAwIwgaAxCzAJBgNVBAYTAlVTMRMw\nEQYDVQQIDApDYWxpZm9ybmlhMRQwEgYDVQQHDAtMb3MgQW5nZWxlczEUMBIGA1UE\nCgwLQmxvY2tkYWVtb24xFDASBgNVBAsMC0Jsb2NrZGFlbW9uMRQwEgYDVQQDDAtC\nbG9ja2RhZW1vbjEkMCIGCSqGSIb3DQEJARYVYWRtaW5AYmxvY2tkYWVtb24uY29t\nMB4XDTI0MTIxMDE0MjQyOVoXDTI5MTIxMDE0MjQyOVowTjELMAkGA1UEBhMCVVMx\nEzARBgNVBAgTCkNhbGlmb3JuaWExFDASBgNVBAcTC0xvcyBBbmdlbGVzMRQwEgYD\nVQQKEwtCbG9ja2RhZW1vbjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABFyD6P8s\n/asEB/7ERpHxye5cpZXXtRYh299ioHemPdKzpmmYqyKqv4G7leXT4bZsAPwqzG3+\nQRg/8HPJA9a8hW2jUjBQMA4GA1UdDwEB/wQEAwIHgDAdBgNVHSUEFjAUBggrBgEF\nBQcDAgYIKwYBBQUHAwEwHwYDVR0jBBgwFoAUW6ouasv5oWo7MZ4ZzlE/mpbDrIMw\nCgYIKoZIzj0EAwIDSQAwRgIhAJZZITPjl9cZNrM1TPRtYo6+TQZw/Q1SO+3xZ5T5\nedeeAiEAlpVDC79W6ym30J6f3gSvOQOJO30+AsJs8gQycf8KK2A=\n-----END CERTIFICATE-----",
      MPCpublicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEtDFBfanInAMHNKKDG2RW/DiSnYeI7scVvfHIwUIRdbPH0gBrsilqxlvsKZTakN8om/Psc6igO+224X8T0J9eMg==",
    },
    {
      url: "https://tsm-sandbox.prd.wallet.blockdaemon.app:8081", // BuilderVault MPC TSM Node 2 - hosts key share 2 in Nitro enclave
      clientCert: "./client.crt",
      clientKey: "./client.key",
      mTLSpublicKey: "-----BEGIN CERTIFICATE-----\nMIICMDCCAdegAwIBAgICB+MwCgYIKoZIzj0EAwIwgaAxCzAJBgNVBAYTAlVTMRMw\nEQYDVQQIDApDYWxpZm9ybmlhMRQwEgYDVQQHDAtMb3MgQW5nZWxlczEUMBIGA1UE\nCgwLQmxvY2tkYWVtb24xFDASBgNVBAsMC0Jsb2NrZGFlbW9uMRQwEgYDVQQDDAtC\nbG9ja2RhZW1vbjEkMCIGCSqGSIb3DQEJARYVYWRtaW5AYmxvY2tkYWVtb24uY29t\nMB4XDTI0MTIxMDE0MjQ0OVoXDTI5MTIxMDE0MjQ0OVowTjELMAkGA1UEBhMCVVMx\nEzARBgNVBAgTCkNhbGlmb3JuaWExFDASBgNVBAcTC0xvcyBBbmdlbGVzMRQwEgYD\nVQQKEwtCbG9ja2RhZW1vbjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABDm0QCLd\nOUS/P7tR6mmbUD9CL/qTgRTu76U3oIB5QYGj7lDHo8ngnBknVRoz9q+vsk3HvLXK\nAFAcIHsiYQjPJvujUjBQMA4GA1UdDwEB/wQEAwIHgDAdBgNVHSUEFjAUBggrBgEF\nBQcDAgYIKwYBBQUHAwEwHwYDVR0jBBgwFoAUW6ouasv5oWo7MZ4ZzlE/mpbDrIMw\nCgYIKoZIzj0EAwIDRwAwRAIgVjSlH7sjQ1yus/A2J4mUh3gGljPQaip7ud4ctxdv\n5hUCIG4gazgsH8T0MOdUFdpJovjcxv2KoMl+xQZmYy/G9Pyb\n-----END CERTIFICATE-----",
      MPCpublicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqvSkhonTeNhlETse8v3X7g4p100EW9xIqg4aRpD8yDXgB0UYjhd+gFtOCsRT2lRhuqNForqqC+YnBsJeZ4ANxg==",
    }
  ];

  const clients: TSMClient[] = [];
  const playerPubkeys: Buffer[] = [];

  for (const rawConfig of configs) {
    const config = await new Configuration(rawConfig.url);
    const cert = new crypto.X509Certificate(rawConfig.mTLSpublicKey as string);

    await config.withPublicKeyPinning(cert.publicKey.export({type: "spki",format: "der"}));

    await config.withMTLSAuthentication(
      rawConfig.clientKey as string,
      rawConfig.clientCert as string,
      false, "", "", "", ""
    );
    const client = await TSMClient.withConfiguration(config);

    playerPubkeys.push(Buffer.from(
      rawConfig.MPCpublicKey as string, "base64"
    ))

    clients.push(client);
  }

  // Generate ECDSA key

  const threshold = 1;
  const playerIds = new Uint32Array(Array(clients.length).fill(0).map((_, i) => i));
  let sessionConfig = await SessionConfig.newSessionConfig(
    await SessionConfig.GenerateSessionID(),
    playerIds,
    playerPubkeys
  );

  const keyIds = ["", ""];

  const keyIdsPromises = [];

  for (const [i, client] of clients.entries()) {
    const func = async () => {
      const ecdsaApi = client.ECDSA();

      keyIds[i] = await ecdsaApi.generateKey(
        sessionConfig,
        threshold,
        curves.SECP256K1,
        ""
      );
    };

    keyIdsPromises.push(func());
  }

  await Promise.all(keyIdsPromises);

  // Validate key IDs
  for (let i = 1; i < keyIds.length; i++) {
    if (keyIds[0] !== keyIds[i]) {
      console.log("Key ids do not match");
      return;
    }
  }

  const keyId = keyIds[0];
  console.log(`Generated key with id ${keyId}`);

}

main()
