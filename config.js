// Set launchISO to an exact ISO-8601 date/time when the launch is locked.
// Example: "2026-09-25T18:00:00-07:00"
window.WATTGOBLIN_CONFIG = {
  launchISO: "2026-09-21T09:00:00-07:00",
  isLive: true,
  mint: "FB2QBAbX5KQnVnWjFMyn6d7zNqXWVWqGey4CUm9Kpump",
  pumpUrl: "https://pump.fun/coin/FB2QBAbX5KQnVnWjFMyn6d7zNqXWVWqGey4CUm9Kpump"
};

// Public Community Mining dashboard configuration.
window.WATTGOBLIN_CONFIG.mining = {
  coin: "QTC",
  algorithm: "Poseidon2",
  minerId: "krxYR9ZGWQ",
  workerApi: "https://pool.kryptex.com/qtc/api/v3/miner/workers/krxYR9ZGWQ",
  balanceApi: "https://pool.kryptex.com/qtc/api/v1/miner/balance/krxYR9ZGWQ",
  payoutsApi: "https://pool.kryptex.com/qtc/api/v1/miner/payouts/krxYR9ZGWQ",
  btcTreasury: "bc1qhvd4zpzpu6hrvkxyl0kh4hndlxwssxq0h5w8f0",
  refreshMs: 60000,
  // Add only completed, verifiable community mining actions here.
  ledger: []
};
