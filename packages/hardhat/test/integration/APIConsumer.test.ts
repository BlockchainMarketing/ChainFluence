import { ethers, deployments, network } from 'hardhat'
import { expect } from 'chai'
import skip from 'mocha-skip-if'
import { developmentChains } from '../../helper-hardhat-config'
import { APIConsumer } from 'types/typechain'

skip
  .if(developmentChains.includes(network.name))
  .describe('APIConsumer Integration Tests', () => {
    let apiConsumer: APIConsumer

    beforeEach(async () => {
      const APIConsumer = await deployments.get('APIConsumer')
      apiConsumer = (await ethers.getContractAt(
        'APIConsumer',
        APIConsumer.address
      )) as APIConsumer
    })

    it('should successfully make an external API request and get a result', async () => {
      const transaction = await apiConsumer.requestVolumeData()
      await transaction.wait()

      //wait 30 secs for oracle to callback
      await new Promise((resolve) => setTimeout(resolve, 30000))

      //Now check the result
      const result = await apiConsumer.volume()
      expect(result).to.be.gt(0)
    })
  })
