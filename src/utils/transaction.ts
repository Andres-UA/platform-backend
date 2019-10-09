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
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log(
        'An identity for the user "user1" does not exist in the wallet',
      );
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: 'user1',
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');

    await contract.submitTransaction(
      'createModel',
      serviceId,
      documentId,
      data,
    );

    await gateway.disconnect();
    return { success: true, message: 'Transaction has been submitted' };
  } catch (error) {
    return {
      success: false,
      message: `Failed to submit transaction: ${error}`,
    };
  }
}

export async function getModelTransaction(docId: string) {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log(
        'An identity for the user "user1" does not exist in the wallet',
      );
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: 'user1',
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');

    const result = await contract.evaluateTransaction('getModelByID', docId);
    return {
      success: true,
      model: result.toString(),
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to evaluate transaction: ${error.message}`,
    };
  }
}

export async function getModelsTransaction(serviceId: string) {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log(
        'An identity for the user "user1" does not exist in the wallet',
      );
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: 'user1',
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');

    const result = await contract.evaluateTransaction(
      'queryAllCars',
      serviceId,
    );
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`,
    );
    return {
      success: true,
      model: result.toString(),
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to evaluate transaction: ${error.message}`,
    };
  }
}

export async function updateTransaction(documentId: string, data: string) {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log(
        'An identity for the user "user1" does not exist in the wallet',
      );
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: 'user1',
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');

    await contract.submitTransaction('updateStateModel', documentId, data);

    await gateway.disconnect();
    return { success: true, message: 'Transaction has been submitted' };
  } catch (error) {
    return {
      success: false,
      message: `Failed to submit transaction: ${error}`,
    };
  }
}
