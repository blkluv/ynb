/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Generado automáticamente por Anchor
 * Program ID: 5RkwWAaXDWKhEDmw8XQsoDqUvbZAphqoeZNX5tFmE6o8
 */
export type PredictionMarket = {
  address: '5RkwWAaXDWKhEDmw8XQsoDqUvbZAphqoeZNX5tFmE6o8'
  metadata: {
    name: 'predictionMarket'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Decentralized Prediction Market on Solana'
  }
  instructions: [
    {
      name: 'claimWinnings'
      docs: ['Claim winnings']
      discriminator: [161, 215, 24, 59, 14, 236, 242, 221]
      accounts: [
        {
          name: 'market'
          writable: true
        },
        {
          name: 'position'
          writable: true
        },
        {
          name: 'marketVault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 97, 117, 108, 116]
              },
              {
                kind: 'account'
                path: 'market'
              }
            ]
          }
        },
        {
          name: 'user'
          writable: true
          signer: true
        }
      ]
      args: []
    },
    {
      name: 'createMarket'
      docs: ['Initialize a new prediction market']
      discriminator: [103, 226, 97, 235, 200, 188, 251, 254]
      accounts: [
        {
          name: 'market'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 97, 114, 107, 101, 116]
              },
              {
                kind: 'account'
                path: 'authority'
              },
              {
                kind: 'arg'
                path: 'question'
              }
            ]
          }
        },
        {
          name: 'authority'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'question'
          type: 'string'
        },
        {
          name: 'description'
          type: 'string'
        },
        {
          name: 'endTime'
          type: 'i64'
        },
        {
          name: 'category'
          type: 'string'
        }
      ]
    },
    {
      name: 'placeBet'
      docs: ['Place a bet on YES or NO']
      discriminator: [222, 62, 67, 220, 63, 166, 126, 33]
      accounts: [
        {
          name: 'market'
          writable: true
        },
        {
          name: 'position'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 115, 105, 116, 105, 111, 110]
              },
              {
                kind: 'account'
                path: 'market'
              },
              {
                kind: 'account'
                path: 'user'
              }
            ]
          }
        },
        {
          name: 'marketVault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 97, 117, 108, 116]
              },
              {
                kind: 'account'
                path: 'market'
              }
            ]
          }
        },
        {
          name: 'user'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'outcome'
          type: 'bool'
        },
        {
          name: 'amount'
          type: 'u64'
        }
      ]
    },
    {
      name: 'resolveMarket'
      docs: ['Resolve the market (only authority)']
      discriminator: [155, 23, 80, 173, 46, 74, 23, 239]
      accounts: [
        {
          name: 'market'
          writable: true
        },
        {
          name: 'authority'
          signer: true
        }
      ]
      args: [
        {
          name: 'winningOutcome'
          type: 'bool'
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'market'
      discriminator: [219, 190, 213, 55, 0, 227, 198, 154]
    },
    {
      name: 'userPosition'
      discriminator: [251, 248, 209, 245, 83, 234, 17, 27]
    }
  ]
  events: [
    {
      name: 'betPlaced'
      discriminator: [88, 88, 145, 226, 126, 206, 32, 0]
    },
    {
      name: 'marketCreated'
      discriminator: [88, 184, 130, 231, 226, 84, 6, 58]
    },
    {
      name: 'marketResolved'
      discriminator: [89, 67, 230, 95, 143, 106, 199, 202]
    },
    {
      name: 'winningsClaimed'
      discriminator: [187, 184, 29, 196, 54, 117, 70, 150]
    }
  ]
  errors: [
    {
      code: 6000
      name: 'questionTooLong'
      msg: 'Question too long (max 200 characters)'
    },
    {
      code: 6001
      name: 'descriptionTooLong'
      msg: 'Description too long (max 1000 characters)'
    },
    {
      code: 6002
      name: 'categoryTooLong'
      msg: 'Category too long (max 50 characters)'
    },
    {
      code: 6003
      name: 'invalidEndTime'
      msg: 'End time must be in the future'
    },
    {
      code: 6004
      name: 'invalidAmount'
      msg: 'Invalid bet amount'
    },
    {
      code: 6005
      name: 'marketResolved'
      msg: 'Market is already resolved'
    },
    {
      code: 6006
      name: 'marketExpired'
      msg: 'Market has expired'
    },
    {
      code: 6007
      name: 'outcomeMismatch'
      msg: 'Cannot change outcome after first bet'
    },
    {
      code: 6008
      name: 'alreadyResolved'
      msg: 'Market is already resolved'
    },
    {
      code: 6009
      name: 'marketNotExpired'
      msg: 'Market has not expired yet'
    },
    {
      code: 6010
      name: 'unauthorized'
      msg: 'unauthorized'
    },
    {
      code: 6011
      name: 'marketNotResolved'
      msg: 'Market is not resolved yet'
    },
    {
      code: 6012
      name: 'alreadyClaimed'
      msg: 'Winnings already claimed'
    },
    {
      code: 6013
      name: 'losingPosition'
      msg: 'This is a losing position'
    }
  ]
  types: [
    {
      name: 'betPlaced'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'market'
            type: 'pubkey'
          },
          {
            name: 'user'
            type: 'pubkey'
          },
          {
            name: 'outcome'
            type: 'bool'
          },
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'totalYes'
            type: 'u64'
          },
          {
            name: 'totalNo'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'market'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'question'
            type: 'string'
          },
          {
            name: 'description'
            type: 'string'
          },
          {
            name: 'category'
            type: 'string'
          },
          {
            name: 'endTime'
            type: 'i64'
          },
          {
            name: 'totalYesAmount'
            type: 'u64'
          },
          {
            name: 'totalNoAmount'
            type: 'u64'
          },
          {
            name: 'resolved'
            type: 'bool'
          },
          {
            name: 'winningOutcome'
            type: {
              option: 'bool'
            }
          },
          {
            name: 'createdAt'
            type: 'i64'
          },
          {
            name: 'bump'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'marketCreated'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'market'
            type: 'pubkey'
          },
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'question'
            type: 'string'
          },
          {
            name: 'endTime'
            type: 'i64'
          }
        ]
      }
    },
    {
      name: 'marketResolved'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'market'
            type: 'pubkey'
          },
          {
            name: 'winningOutcome'
            type: 'bool'
          },
          {
            name: 'totalYes'
            type: 'u64'
          },
          {
            name: 'totalNo'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'userPosition'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'user'
            type: 'pubkey'
          },
          {
            name: 'market'
            type: 'pubkey'
          },
          {
            name: 'outcome'
            type: 'bool'
          },
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'claimed'
            type: 'bool'
          },
          {
            name: 'bump'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'winningsClaimed'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'market'
            type: 'pubkey'
          },
          {
            name: 'user'
            type: 'pubkey'
          },
          {
            name: 'amount'
            type: 'u64'
          }
        ]
      }
    }
  ]
}

export const IDL: PredictionMarket = {
  address: '5RkwWAaXDWKhEDmw8XQsoDqUvbZAphqoeZNX5tFmE6o8',
  metadata: {
    name: 'predictionMarket',
    version: '0.1.0',
    spec: '0.1.0',
    description: 'Decentralized Prediction Market on Solana',
  },
  instructions: [
    {
      name: 'claimWinnings',
      docs: ['Claim winnings'],
      discriminator: [161, 215, 24, 59, 14, 236, 242, 221],
      accounts: [
        {
          name: 'market',
          writable: true,
        },
        {
          name: 'position',
          writable: true,
        },
        {
          name: 'marketVault',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [118, 97, 117, 108, 116],
              },
              {
                kind: 'account',
                path: 'market',
              },
            ],
          },
        },
        {
          name: 'user',
          writable: true,
          signer: true,
        },
      ],
      args: [],
    },
    {
      name: 'createMarket',
      docs: ['Initialize a new prediction market'],
      discriminator: [103, 226, 97, 235, 200, 188, 251, 254],
      accounts: [
        {
          name: 'market',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 114, 107, 101, 116],
              },
              {
                kind: 'account',
                path: 'authority',
              },
              {
                kind: 'arg',
                path: 'question',
              },
            ],
          },
        },
        {
          name: 'authority',
          writable: true,
          signer: true,
        },
        {
          name: 'systemProgram',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [
        {
          name: 'question',
          type: 'string',
        },
        {
          name: 'description',
          type: 'string',
        },
        {
          name: 'endTime',
          type: 'i64',
        },
        {
          name: 'category',
          type: 'string',
        },
      ],
    },
    {
      name: 'placeBet',
      docs: ['Place a bet on YES or NO'],
      discriminator: [222, 62, 67, 220, 63, 166, 126, 33],
      accounts: [
        {
          name: 'market',
          writable: true,
        },
        {
          name: 'position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              {
                kind: 'account',
                path: 'market',
              },
              {
                kind: 'account',
                path: 'user',
              },
            ],
          },
        },
        {
          name: 'marketVault',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [118, 97, 117, 108, 116],
              },
              {
                kind: 'account',
                path: 'market',
              },
            ],
          },
        },
        {
          name: 'user',
          writable: true,
          signer: true,
        },
        {
          name: 'systemProgram',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [
        {
          name: 'outcome',
          type: 'bool',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'resolveMarket',
      docs: ['Resolve the market (only authority)'],
      discriminator: [155, 23, 80, 173, 46, 74, 23, 239],
      accounts: [
        {
          name: 'market',
          writable: true,
        },
        {
          name: 'authority',
          signer: true,
        },
      ],
      args: [
        {
          name: 'winningOutcome',
          type: 'bool',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'market',
      discriminator: [219, 190, 213, 55, 0, 227, 198, 154],
    },
    {
      name: 'userPosition',
      discriminator: [251, 248, 209, 245, 83, 234, 17, 27],
    },
  ],
  events: [
    {
      name: 'betPlaced',
      discriminator: [88, 88, 145, 226, 126, 206, 32, 0],
    },
    {
      name: 'marketCreated',
      discriminator: [88, 184, 130, 231, 226, 84, 6, 58],
    },
    {
      name: 'marketResolved',
      discriminator: [89, 67, 230, 95, 143, 106, 199, 202],
    },
    {
      name: 'winningsClaimed',
      discriminator: [187, 184, 29, 196, 54, 117, 70, 150],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'questionTooLong',
      msg: 'Question too long (max 200 characters)',
    },
    {
      code: 6001,
      name: 'descriptionTooLong',
      msg: 'Description too long (max 1000 characters)',
    },
    {
      code: 6002,
      name: 'categoryTooLong',
      msg: 'Category too long (max 50 characters)',
    },
    {
      code: 6003,
      name: 'invalidEndTime',
      msg: 'End time must be in the future',
    },
    {
      code: 6004,
      name: 'invalidAmount',
      msg: 'Invalid bet amount',
    },
    {
      code: 6005,
      name: 'marketResolved',
      msg: 'Market is already resolved',
    },
    {
      code: 6006,
      name: 'marketExpired',
      msg: 'Market has expired',
    },
    {
      code: 6007,
      name: 'outcomeMismatch',
      msg: 'Cannot change outcome after first bet',
    },
    {
      code: 6008,
      name: 'alreadyResolved',
      msg: 'Market is already resolved',
    },
    {
      code: 6009,
      name: 'marketNotExpired',
      msg: 'Market has not expired yet',
    },
    {
      code: 6010,
      name: 'unauthorized',
      msg: 'unauthorized',
    },
    {
      code: 6011,
      name: 'marketNotResolved',
      msg: 'Market is not resolved yet',
    },
    {
      code: 6012,
      name: 'alreadyClaimed',
      msg: 'Winnings already claimed',
    },
    {
      code: 6013,
      name: 'losingPosition',
      msg: 'This is a losing position',
    },
  ],
  types: [
    {
      name: 'betPlaced',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'market',
            type: 'pubkey',
          },
          {
            name: 'user',
            type: 'pubkey',
          },
          {
            name: 'outcome',
            type: 'bool',
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'totalYes',
            type: 'u64',
          },
          {
            name: 'totalNo',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'market',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'pubkey',
          },
          {
            name: 'question',
            type: 'string',
          },
          {
            name: 'description',
            type: 'string',
          },
          {
            name: 'category',
            type: 'string',
          },
          {
            name: 'endTime',
            type: 'i64',
          },
          {
            name: 'totalYesAmount',
            type: 'u64',
          },
          {
            name: 'totalNoAmount',
            type: 'u64',
          },
          {
            name: 'resolved',
            type: 'bool',
          },
          {
            name: 'winningOutcome',
            type: {
              option: 'bool',
            },
          },
          {
            name: 'createdAt',
            type: 'i64',
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'marketCreated',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'market',
            type: 'pubkey',
          },
          {
            name: 'authority',
            type: 'pubkey',
          },
          {
            name: 'question',
            type: 'string',
          },
          {
            name: 'endTime',
            type: 'i64',
          },
        ],
      },
    },
    {
      name: 'marketResolved',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'market',
            type: 'pubkey',
          },
          {
            name: 'winningOutcome',
            type: 'bool',
          },
          {
            name: 'totalYes',
            type: 'u64',
          },
          {
            name: 'totalNo',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'userPosition',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'user',
            type: 'pubkey',
          },
          {
            name: 'market',
            type: 'pubkey',
          },
          {
            name: 'outcome',
            type: 'bool',
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'claimed',
            type: 'bool',
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'winningsClaimed',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'market',
            type: 'pubkey',
          },
          {
            name: 'user',
            type: 'pubkey',
          },
          {
            name: 'amount',
            type: 'u64',
          },
        ],
      },
    },
  ],
}
