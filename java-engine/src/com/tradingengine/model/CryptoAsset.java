package com.tradingengine.model;

public class CryptoAsset extends Instrument {
    private String blockchain;
    private String contractAddress;

    public CryptoAsset(String symbol, String blockchain, String contractAddress) {
        super(symbol);
        this.blockchain = blockchain;
        this.contractAddress = contractAddress;
    }

    public String getBlockchain() {
        return blockchain;
    }

    public String getContractAddress() {
        return contractAddress;
    }
}
