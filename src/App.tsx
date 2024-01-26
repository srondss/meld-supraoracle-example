import "./App.css";

import { BigNumber, ethers } from "ethers";

import { ExternalProvider } from "@ethersproject/providers";
import { formatUnits } from "ethers/lib/utils";
import { useState } from "react";

declare global {
    interface Window {
        ethereum: ExternalProvider;
    }
}

const abi = [
    {
        inputs: [
            {
                internalType: "contract ISupraSValueFeed",
                name: "_sValueFeed",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "pair_id_1",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "pair_id_2",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "operation",
                type: "uint256",
            },
        ],
        name: "getDerivedValueOfPair",
        outputs: [
            {
                components: [
                    {
                        internalType: "int256",
                        name: "roundDifference",
                        type: "int256",
                    },
                    {
                        internalType: "uint256",
                        name: "derivedPrice",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "decimals",
                        type: "uint256",
                    },
                ],
                internalType: "struct ISupraSValueFeed.derivedData",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_priceIndex",
                type: "uint256",
            },
        ],
        name: "getPrice",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "round",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "decimals",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "time",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "price",
                        type: "uint256",
                    },
                ],
                internalType: "struct ISupraSValueFeed.priceFeed",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256[]",
                name: "_pairIndexes",
                type: "uint256[]",
            },
        ],
        name: "getPriceForMultiplePair",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "round",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "decimals",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "time",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "price",
                        type: "uint256",
                    },
                ],
                internalType: "struct ISupraSValueFeed.priceFeed[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getSupraSvalueFeed",
        outputs: [
            {
                internalType: "contract ISupraSValueFeed",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract ISupraSValueFeed",
                name: "_newSValueFeed",
                type: "address",
            },
        ],
        name: "updateSupraSvalueFeed",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

function App() {
    const [pairID, setPairId] = useState<number>(0);
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    async function getOraclePrice() {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        const oracleContract = new ethers.Contract(
            "YOUR_CONTRACT_ADDRESS",
            abi,
            signer
        );

        const price: BigNumber = (await oracleContract.getPrice(pairID)).price;

        const decimals: BigNumber = (await oracleContract.getPrice(pairID))
            .decimals;

        const formattedPrice = formatUnits(price, decimals.toString());

        setPrice(parseFloat(formattedPrice));
        setLoading(false);
    }

    return (
        <div>
            <h1>MELD Oracle Example</h1>
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                }}
            >
                <input
                    type="number"
                    placeholder="Enter a Pair ID"
                    style={{ width: "15rem" }}
                    onChange={(e) => setPairId(parseInt(e.target.value))}
                />
                <button
                    onClick={() => {
                        getOraclePrice();
                    }}
                >
                    Get Oracle Price
                </button>
            </div>
            {loading && (
                <div>
                    <h2>Loading...</h2>
                </div>
            )}
            {price && (
                <div>
                    <h2>Price: ${price} </h2>
                </div>
            )}
        </div>
    );
}

export default App;
