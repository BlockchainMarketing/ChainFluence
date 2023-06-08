import React from 'react'
import { useEthers } from '@usedapp/core'
import { Field, FormikProvider, useFormik } from 'formik'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Tooltip,
  Divider,
} from '@chakra-ui/react'
import { CreateCampaignFormValues } from '../../types/CreateFormValues'
import { isEmpty, isFractionalNumber, isPositiveNumber } from '../../lib/helper'

/**
 * Prop Types
 */
interface CreateCampaignFormProps {
  onSubmit: (args: CreateCampaignFormValues) => Promise<void>
  isLoading: boolean
}

/**
 * Component
 */
export const CreateCampaignForm = ({
  onSubmit,
  isLoading,
}: CreateCampaignFormProps): JSX.Element => {
  const { account, error } = useEthers()

  const formik = useFormik({
    initialValues: {
      name: '',
      budget: '',
      validationThreshold: '',
      partakersLimit: '',
    },
    onSubmit,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormikProvider value={formik}>
        <FormControl isInvalid={formik.touched.name && !!formik.errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Tooltip
            label=" A descriptive name for a campaign of NFTs used by third party applications like marketplaces and wallets."
            placement="right-start"
            fontSize="xs"
            hasArrow
          >
            <div>
              <Field
                as={Input}
                bg="white"
                name="name"
                validate={isEmpty}
                placeholder="My Sample Campaign"
              />
            </div>
          </Tooltip>
          {formik.errors.name && formik.touched.name && (
            <FormErrorMessage>Name {formik.errors.name}</FormErrorMessage>
          )}
        </FormControl>
        <Divider
          orientation="horizontal"
          margin="40px 20px 20px 0px"
          border="width 10px"
        />
        <FormControl
          mt="4"
          isInvalid={formik.touched.budget && !!formik.errors.budget}
        >
          <FormLabel htmlFor="budget">Budget</FormLabel>
          <Tooltip
            label="The total budget allocated to your campaign (in ETH)."
            placement="right-start"
            fontSize="xs"
            hasArrow
          >
            <div>
              <Field
                as={Input}
                bg="white"
                name="budget"
                validate={isFractionalNumber}
                placeholder="10"
              />
            </div>
          </Tooltip>
          {formik.errors.budget && formik.touched.budget && (
            <FormErrorMessage>Budget {formik.errors.budget}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          mt="4"
          isInvalid={
            formik.touched.validationThreshold &&
            !!formik.errors.validationThreshold
          }
        >
          <FormLabel htmlFor="validationThreshold">Retweet Milestone</FormLabel>
          <Tooltip
            label="Minimum amount of retweets for a participant to win"
            placement="right-start"
            fontSize="xs"
            hasArrow
          >
            <div>
              <Field
                as={Input}
                bg="white"
                name="validationThreshold"
                validate={isPositiveNumber}
                placeholder="100"
              />
            </div>
          </Tooltip>
          {formik.errors.validationThreshold &&
            formik.touched.validationThreshold && (
              <FormErrorMessage>
                Validation Threshold {formik.errors.validationThreshold}
              </FormErrorMessage>
            )}
        </FormControl>

        <FormControl
          mt="4"
          isInvalid={
            formik.touched.partakersLimit && !!formik.errors.partakersLimit
          }
        >
          <FormLabel htmlFor="partakersLimit">Number of winners</FormLabel>
          <Tooltip
            label="Maximum number of winners for this campaign"
            placement="right-start"
            fontSize="xs"
            hasArrow
          >
            <div>
              <Field
                as={Input}
                bg="white"
                name="partakersLimit"
                validate={isPositiveNumber}
                placeholder="5"
              />
            </div>
          </Tooltip>
          {formik.errors.partakersLimit && formik.touched.partakersLimit && (
            <FormErrorMessage>
              Partakers Limit {formik.errors.partakersLimit}
            </FormErrorMessage>
          )}
        </FormControl>
        <Tooltip
          hasArrow
          label="Connect to a wallet"
          placement="top"
          shouldWrapChildren
          isDisabled={!!account}
        >
          <Button
            mt="8"
            colorScheme="teal"
            type="submit"
            isLoading={isLoading}
            disabled={
              !account ||
              !!error ||
              isLoading ||
              !formik.dirty ||
              Array.isArray(formik.errors) ||
              Object.values(formik.errors).toString() != ''
            }
          >
            Deploy Campaign
          </Button>
        </Tooltip>
      </FormikProvider>
    </form>
  )
}
