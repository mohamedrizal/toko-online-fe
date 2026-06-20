import { Box, Flex, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react'

// --- SVG Icons ---
const FacebookIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
const YoutubeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
const InstagramIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>

function Footer() {
  const linkHover = { color: 'gray.800', cursor: 'pointer' }

  return (
    <Box bg="white" pt="16" pb="8" borderTopWidth="1px" borderColor="gray.100">
      <Box className="container" px={{ base: '4', md: '8' }}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: '2fr 1fr 1fr 1fr 1.5fr' }} gap="8" mb="12">
          
          {/* Column 1: Logo & Socials */}
          <VStack align="flex-start" gap="10px">
            <Box cursor="pointer">
              <Text fontSize="4xl" fontWeight="900" color="#f59e0b" fontFamily="cursive" letterSpacing="tight" lineHeight="1" margin="0">
                Kkomi<Box as="span" fontSize="sm" color="#fcd34d" fontWeight="normal" ml="1">®</Box>
              </Text>
              <Text fontSize="10px" color="gray.500" fontWeight="medium">Korean Cafe</Text>
            </Box>
            <HStack gap="3">
              <Flex align="center" justify="center" w="8" h="8" border="solid" borderWidth="1px" borderColor="#e4e4e4" color="gray.500" cursor="pointer" _hover={{ borderColor: 'gray.400', color: 'gray.700' }}>
                <FacebookIcon />
              </Flex>
              <Flex align="center" justify="center" w="8" h="8" border="solid" borderWidth="1px" borderColor="#e4e4e4" color="gray.500" cursor="pointer" _hover={{ borderColor: 'gray.400', color: 'gray.700' }}>
                <YoutubeIcon />
              </Flex>
              <Flex align="center" justify="center" w="8" h="8" border="solid" borderWidth="1px" borderColor="#e4e4e4" color="gray.500" cursor="pointer" _hover={{ borderColor: 'gray.400', color: 'gray.700' }}>
                <InstagramIcon />
              </Flex>
            </HStack>
          </VStack>

          {/* Column 2: Ultras */}
          <VStack align="flex-start" gap="3">
            <Text fontSize="md" fontWeight="bold" color="gray.800" mb="1">Ultras</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">About us</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Conditions</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Our Journals</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Careers</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Affiliate Programme</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Ultras Press</Text>
          </VStack>

          {/* Column 3: Customer Service */}
          <VStack align="flex-start" gap="3">
            <Text fontSize="md" fontWeight="bold" color="gray.800" mb="1">Customer Service</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">FAQ</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Contact</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Privacy Policy</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Returns & Refunds</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Cookie Guidelines</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Delivery Information</Text>
          </VStack>

          {/* Column 4: Customer Service (Duplicated like the design) */}
          <VStack align="flex-start" gap="3">
            <Text fontSize="md" fontWeight="bold" color="gray.800" mb="1">Customer Service</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">FAQ</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Contact</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Privacy Policy</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Returns & Refunds</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Cookie Guidelines</Text>
            <Text fontSize="sm" color="gray.500" _hover={linkHover} cursor="pointer" margin="0">Delivery Information</Text>
          </VStack>

          {/* Column 5: Subscribe Us */}
          <VStack align="flex-start" gap="4">
            <Text fontSize="md" fontWeight="bold" color="gray.800">Subscribe Us</Text>
            <Text fontSize="sm" color="gray.500" lineHeight="tall" margin="0">
              Subscribe to our newsletter to get updates about our grand offers.
            </Text>
            <Flex w="100%" mt="2">
              <Input 
                placeholder="Email Address" 
                bg="gray.50" 
                border="none" 
                borderRightRadius="0"
                _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
                fontSize="sm"
                px="4"
              />
              <Box 
                as="button" 
                bg="gray.800" 
                color="white" 
                px="10px" 
                fontSize="sm" 
                fontWeight="medium"
                borderLeftRadius="0"
                borderRightRadius="md"
                _hover={{ bg: 'black' }}
              >
                Subscribe
              </Box>
            </Flex>
          </VStack>

        </Grid>

        {/* Bottom Copyright */}
        <Box mt="8">
          <Text fontSize="xs" color="gray.400">
            © 2025 Foodmart. All rights reserved.
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer