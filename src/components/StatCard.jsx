import { Box, Flex, Text } from '@chakra-ui/react'

const StatCard = ({ title, value, color, icon: Icon }) => (
  <Box bg="white" p={5} borderRadius="xl" boxShadow="sm" borderBottom="20px solid" borderBottomColor={`${color}.400`}>
    <Flex justify="space-between" align="center">
      <Box>
        <Text fontSize="2xl" fontWeight="bold" color={`${color}.400`} mb={1}>{value}</Text>
        <Text fontSize="sm" color="gray.600" fontWeight="bold">{title}</Text>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" w="40px" h="40px" bg={`${color}.50`} borderRadius="full" color={`${color}.400`}>
        {Icon && <Icon />}
      </Box>
    </Flex>
  </Box>
)

export default StatCard