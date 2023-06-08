import { Contract, ContractFactory, ethers, Signer } from 'ethers'

import NFTCollection from '../artifacts/contracts/NFTCollection.sol/NFTCollection.json'
import ChainFluenceV1 from '../artifacts/contracts/ChainFluenceV1.sol/ChainFluenceV1.json'

import {
  VRF_CALLBACK_GAS_LIMIT,
  VRF_COORDINATOR_V2_ADDRESS,
  VRF_GAS_LANE,
} from '../conf/config'
import {
  CreateCollectionFormValues,
  CreateCampaignFormValues,
} from '../types/CreateFormValues'

export async function deployCampaignCollection(
  campaignParams: CreateCampaignFormValues,
  signer: Signer
): Promise<Contract> {
  const campaignCollection = new ContractFactory(
    ChainFluenceV1.abi,
    ChainFluenceV1.bytecode,
    signer
  )

  const deployedContract = await campaignCollection.deploy(
    campaignParams.name,
    ethers.utils.parseEther(campaignParams.budget),
    campaignParams.validationThreshold,
    campaignParams.partakersLimit,
    VRF_CALLBACK_GAS_LIMIT
    // , {
    //     value: mintCost.mul(mintAmount),
    //   }
  )

  return deployedContract
}

export async function deployNFTCollection(
  nftParams: CreateCollectionFormValues,
  signer: Signer,
  chainId: number
): Promise<Contract> {
  const nftCollection = new ContractFactory(
    NFTCollection.abi,
    NFTCollection.bytecode,
    signer
  )
  const deployedContract = await nftCollection.deploy(
    nftParams.name,
    nftParams.symbol,
    nftParams.maxSupply,
    ethers.utils.parseEther(nftParams.mintCost),
    nftParams.revealBatchSize,
    nftParams.revealInterval,
    VRF_COORDINATOR_V2_ADDRESS[chainId],
    nftParams.vrfSubscriptionId,
    VRF_GAS_LANE[chainId],
    VRF_CALLBACK_GAS_LIMIT
  )

  return deployedContract
}
