// Type definitions for Prediction Market Program

import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export type PredictionMarket = {
  version: "0.1.0";
  name: "prediction_market";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "globalState";
          isMut: true;
          isSigner: true;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "createMarket";
      accounts: [
        {
          name: "market";
          isMut: true;
          isSigner: true;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "question";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        },
        {
          name: "endTime";
          type: "i64";
        }
      ];
    },
    {
      name: "placeBet";
      accounts: [
        {
          name: "market";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "betYes";
          type: "bool";
        }
      ];
    },
    {
      name: "resolveMarket";
      accounts: [
        {
          name: "market";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "outcome";
          type: "bool";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "GlobalState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "totalMarkets";
            type: "u64";
          },
          {
            name: "totalVolume";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "Market";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "question";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "endTime";
            type: "i64";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "yesAmount";
            type: "u64";
          },
          {
            name: "noAmount";
            type: "u64";
          },
          {
            name: "resolved";
            type: "bool";
          },
          {
            name: "winningOutcome";
            type: "bool";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "QuestionTooLong";
      msg: "Question too long (max 200 characters)";
    },
    {
      code: 6001;
      name: "InvalidEndTime";
      msg: "Invalid end time";
    },
    {
      code: 6002;
      name: "MarketResolved";
      msg: "Market already resolved";
    },
    {
      code: 6003;
      name: "MarketExpired";
      msg: "Market expired";
    },
    {
      code: 6004;
      name: "BetTooSmall";
      msg: "Bet too small (min 0.01 SOL)";
    },
    {
      code: 6005;
      name: "AlreadyResolved";
      msg: "Already resolved";
    },
    {
      code: 6006;
      name: "MarketNotExpired";
      msg: "Market not expired yet";
    },
    {
      code: 6007;
      name: "Unauthorized";
      msg: "Unauthorized";
    },
    {
      code: 6008;
      name: "MathOverflow";
      msg: "Math overflow";
    }
  ];
};

export const IDL: PredictionMarket = {
  version: "0.1.0",
  name: "prediction_market",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "globalState",
          isMut: true,
          isSigner: true,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "createMarket",
      accounts: [
        {
          name: "market",
          isMut: true,
          isSigner: true,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "question",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
        {
          name: "endTime",
          type: "i64",
        },
      ],
    },
    {
      name: "placeBet",
      accounts: [
        {
          name: "market",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "betYes",
          type: "bool",
        },
      ],
    },
    {
      name: "resolveMarket",
      accounts: [
        {
          name: "market",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "outcome",
          type: "bool",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "GlobalState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "totalMarkets",
            type: "u64",
          },
          {
            name: "totalVolume",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "Market",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "question",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "endTime",
            type: "i64",
          },
          {
            name: "createdAt",
            type: "i64",
          },
          {
            name: "yesAmount",
            type: "u64",
          },
          {
            name: "noAmount",
            type: "u64",
          },
          {
            name: "resolved",
            type: "bool",
          },
          {
            name: "winningOutcome",
            type: "bool",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "QuestionTooLong",
      msg: "Question too long (max 200 characters)",
    },
    {
      code: 6001,
      name: "InvalidEndTime",
      msg: "Invalid end time",
    },
    {
      code: 6002,
      name: "MarketResolved",
      msg: "Market already resolved",
    },
    {
      code: 6003,
      name: "MarketExpired",
      msg: "Market expired",
    },
    {
      code: 6004,
      name: "BetTooSmall",
      msg: "Bet too small (min 0.01 SOL)",
    },
    {
      code: 6005,
      name: "AlreadyResolved",
      msg: "Already resolved",
    },
    {
      code: 6006,
      name: "MarketNotExpired",
      msg: "Market not expired yet",
    },
    {
      code: 6007,
      name: "Unauthorized",
      msg: "Unauthorized",
    },
    {
      code: 6008,
      name: "MathOverflow",
      msg: "Math overflow",
    },
  ],
};

