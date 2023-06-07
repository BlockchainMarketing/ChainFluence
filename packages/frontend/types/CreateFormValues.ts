export type CreateCollectionFormValues = {
  name: string
  symbol: string
  maxSupply: string
  mintCost: string
  revealBatchSize: string
  revealInterval: string
  vrfSubscriptionId: string
}

export type CreateCampaignFormValues = {
  name: string
  budget: string
  validationThreshold: string
  partakersLimit: string
}
