import {
    beginCell,
    Address,
    toNano,
    TonClient,
    JettonMaster
} from '@ton/ton';

import type { SendTransactionRequest } from '@tonconnect/ui-react';
import { fromDecimals } from './decimals';

const USDT_MASTER = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'; // ← сюда реальный USDT master
const USDT_DECIMALS = 6; // у USDT 6 decimals

const tonClient = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

export const getJettonSendTransactionRequest = async (
    amountStr: string,
    recipientAddressStr: string,
    senderAddressStr: string,
): Promise<SendTransactionRequest> => {

    const amount = fromDecimals(amountStr, USDT_DECIMALS);

    const recipient = Address.parse(recipientAddressStr);
    const sender = Address.parse(senderAddressStr);

    // 🔹 1. Открываем USDT master
    const jettonMaster = tonClient.open(
        JettonMaster.create(Address.parse(USDT_MASTER))
    );

    // 🔹 2. Получаем jetton wallet пользователя
    const userJettonWallet = await jettonMaster.getWalletAddress(sender);

    // 🔹 3. Формируем payload
    const body = beginCell()
        .storeUint(0xf8a7ea5, 32)
        .storeUint(0, 64)
        .storeCoins(amount)
        .storeAddress(recipient)
        .storeAddress(sender)
        .storeBit(0)
        .storeCoins(toNano('0.01'))
        .storeBit(0)
        .endCell();

        const data = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [{
            address: userJettonWallet.toString(), // ← jetton wallet пользователя
            amount: toNano('0.05').toString(),
            payload: body.toBoc().toString('base64'),
        }]
    }

        console.log('data for return for transaction: ', data)

    return data;
};
