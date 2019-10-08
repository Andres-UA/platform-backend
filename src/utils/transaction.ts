import { FileSystemWallet, Gateway } from 'fabric-network';
import * as path from 'path';

const ccpPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'platform-network',
  'first-network',
  'connection-org1.json',
);

export async function createModelTransaction(
  serviceId: string,
  documentId: string,
  data: string,
) {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log(
        'An identity for the user "user1" does not exist in the wallet',
      );
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: 'user1',
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('fabcar');

    // Submit the specified transaction.
    await contract.submitTransaction(
      'createModel',
      serviceId,
      documentId,
      data,
    );
    console.log(`Transaction has been submitted`);
    // Disconnect from the gateway.
    await gateway.disconnect();
    return { success: true, message: 'Transaction has been submitted' };
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
    return {
      success: false,
      message: `Failed to submit transaction: ${error}`,
    };
  }
}

export async function queryTransaction(docId: string) {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log(
        'An identity for the user "user1" does not exist in the wallet',
      );
      console.log('Run the registerUser.ts application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: 'user1',
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('fabcar');

    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction('getModelByID', docId);
    return {
      success: true,
      model: result.toString()
    }
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`,
    );
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}

export async function updateTransaction(
  serviceId: string,
  documentId: string,
  data: string,
) {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log(
        'An identity for the user "user1" does not exist in the wallet',
      );
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: 'user1',
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('fabcar');

    // Submit the specified transaction.
    await contract.submitTransaction('updateStateModel', documentId, data);
    console.log(`Transaction has been submitted`);

    return { success: true, message: 'Transaction has been submitted' };

    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
    return {
      success: false,
      message: `Failed to submit transaction: ${error}`,
    };
  }
}
