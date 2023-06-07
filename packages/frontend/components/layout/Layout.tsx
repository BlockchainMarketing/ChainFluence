import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Text,
  Box,
  Button,
  Container,
  Flex,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
} from '@chakra-ui/react'
import { useEthers, useNotifications } from '@usedapp/core'
import blockies from 'blockies-ts'
import NextLink from 'next/link'
import TagManager from 'react-gtm-module'
import React, { useEffect } from 'react'
import { getErrorMessage } from '../../lib/utils'
import { Balance } from '../Balance'
import { ConnectWallet } from '../ConnectWallet'
import { Head, MetaProps } from './Head'
import { Error } from '../Error'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

/**
 * Constants & Helpers
 */

// Title text for the various transaction notifications.
const TRANSACTION_TYPE_TITLES = {
  transactionStarted: 'Started',
  transactionSucceed: 'Completed',
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

// Takes a long hash string and truncates it.
function truncateHash(hash: string, length = 38): string {
  return hash.replace(hash.substring(6, length), '...')
}

/**
 * Prop Types
 */
interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

/**
 * Component
 */
export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const { account, deactivate, error } = useEthers()
  const { notifications } = useNotifications()

  useEffect(() => {
    if (GTM_ID) {
      TagManager.initialize({ gtmId: GTM_ID })
    }
  }, [])

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <Container maxWidth="container.xl">
          <SimpleGrid
            columns={[1, 1, 1, 2]}
            alignItems="center"
            justifyContent="space-between"
            py="8"
          >
            <Flex py={[4, null, null, 0]}>
              <NextLink href="/" passHref>
                <Link px="4" py="1">
                  Home
                </Link>
              </NextLink>
              <NextLink href="/create" passHref>
                <Link px="4" py="1">
                  Create Campaign
                </Link>
              </NextLink>
              <NextLink href="/open" passHref>
                <Link px="4" py="1">
                  Open Campaign
                </Link>
              </NextLink>
              <Menu>
                <MenuButton as={Link} px="4">
                  Old
                </MenuButton>
                <MenuList>
                  <NextLink href="/_old/feeds" passHref>
                    <MenuItem>Data Feeds</MenuItem>
                  </NextLink>
                  <NextLink href="/_old/vrf" passHref>
                    <MenuItem>Randomness</MenuItem>
                  </NextLink>
                  <NextLink href="/_old/external-api" passHref>
                    <MenuItem>External API</MenuItem>
                  </NextLink>
                  <NextLink href="/_old/automation" passHref>
                    <MenuItem>Automation</MenuItem>
                  </NextLink>
                </MenuList>
              </Menu>
            </Flex>
            {account ? (
              <Flex
                order={[-1, null, null, 2]}
                alignItems={'center'}
                justifyContent={['flex-start', null, null, 'flex-end']}
              >
                <Balance />
                <Image ml="4" src={blockieImageSrc} alt="blockie" />
                <Menu placement="bottom-end">
                  <MenuButton as={Button} ml="4">
                    {truncateHash(account)}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        deactivate()
                      }}
                    >
                      Disconnect
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            ) : (
              <ConnectWallet />
            )}
          </SimpleGrid>
        </Container>
      </header>
      <main>
        <Container maxWidth="container.xl">
          {error && <Error message={getErrorMessage(error)} />}
          {children}
          {notifications.map((notification) => {
            if (notification.type === 'walletConnected') {
              return null
            }
            return (
              <Alert
                key={notification.id}
                status="success"
                position="fixed"
                bottom="8"
                right="8"
                width="400px"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {notification.transactionName}{' '}
                    {TRANSACTION_TYPE_TITLES[notification.type]}
                  </AlertTitle>
                  {'transaction' in notification && (
                    <AlertDescription overflow="hidden">
                      Transaction Hash:
                      {truncateHash(notification.transaction.hash, 61)}
                    </AlertDescription>
                  )}
                </Box>
              </Alert>
            )
          })}
        </Container>
      </main>
      <footer>
        <Container as="footer" mt="8" maxWidth="container.xl">
          <Flex justify="space-between" align="center">
            <Link
              href="https://github.com/paradoux/blockchain-marketing-marketplace"
              isExternal
            >
              <Flex>
                <Image src="../images/github.svg" boxSize="20px" />
                <Text ml={2}>GitHub</Text>
              </Flex>
            </Link>
            <Flex>
              <Link href="https://chn.lk/3R7BPNw" isExternal>
                <Image
                  src="https://chain.link/badge-automation-black"
                  height="72px"
                  width="150px"
                  alt="automation secured with chainlink"
                  mr={2}
                />
              </Link>
              <Link href="https://chn.lk/3C1ffBV" isExternal>
                <Image
                  src="https://chain.link/badge-randomness-black"
                  height="72px"
                  width="150px"
                  alt="randomness secured with chainlink"
                  ml={2}
                />
              </Link>
            </Flex>
          </Flex>
        </Container>
      </footer>
    </>
  )
}
