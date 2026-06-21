import { useState, useEffect } from 'react'
import { Box, Flex, Text, Button as ChakraButton } from '@chakra-ui/react'

function DataTable({
  columns = [],
  data = [],
  keyField = 'id',
  emptyText = 'Data tidak tersedia.',
  page,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
}) {
  const [localPage, setLocalPage] = useState(1)

  const isControlled = onPageChange !== undefined
  const currentPage = isControlled ? page : localPage
  
  // Calculate total pages for local data if not controlled
  const calculatedTotalPages = isControlled ? (totalPages || 1) : Math.max(1, Math.ceil(data.length / itemsPerPage))

  // Ensure local page doesn't exceed new total pages when data is deleted
  useEffect(() => {
    if (!isControlled && localPage > calculatedTotalPages) {
      setLocalPage(calculatedTotalPages)
    }
  }, [data.length, calculatedTotalPages, isControlled, localPage])

  if (!data.length) {
    return <Text color="gray.500" fontStyle="italic">{emptyText}</Text>
  }

  const handlePageChange = (newPage) => {
    if (isControlled) {
      onPageChange(newPage)
    } else {
      setLocalPage(newPage)
    }
  }

  // Slice data for local pagination, or slice controlled data if it exceeds itemsPerPage (e.g. after a local push)
  const displayedData = isControlled
    ? data.slice(0, itemsPerPage)
    : data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <Box>
      <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="lg">
        <Box as="table" w="100%" textAlign="left" borderCollapse="collapse">
          <Box as="thead" bg="gray.50">
            <Box as="tr">
              {columns.map((column) => (
                <Box 
                  as="th" 
                  key={column.header} 
                  p={4} 
                  fontSize="sm" 
                  fontWeight="semibold" 
                  color="gray.600" 
                  borderBottom="1px solid" 
                  borderColor="gray.200"
                >
                  {column.header}
                </Box>
              ))}
            </Box>
          </Box>

          <Box as="tbody">
            {displayedData.map((row, rowIndex) => (
              <Box 
                as="tr" 
                key={row[keyField] ?? rowIndex} 
                _hover={{ bg: 'gray.50' }} 
                transition="background 0.2s"
              >
                {columns.map((column) => (
                  <Box 
                    as="td" 
                    key={`${column.header}-${row[keyField] ?? rowIndex}`} 
                    p={4} 
                    fontSize="sm" 
                    borderBottom="1px solid" 
                    borderColor="gray.100"
                  >
                    {column.render
                      ? column.render(row, displayedData, rowIndex)
                      : column.accessor
                        ? row[column.accessor]
                        : '-'}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Pagination Controls */}
      {(isControlled || calculatedTotalPages > 1) && (
        <Flex justify="space-between" align="center" mt={4}>
          <Text fontSize="sm" color="gray.600">
            Halaman {currentPage} dari {calculatedTotalPages}
          </Text>
          <Flex gap={2}>
            <ChakraButton 
              size="sm" 
              variant="outline" 
              bg="transparent"
              padding="0"
              border="none"
              colorScheme="brand"
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage <= 1}
              opacity={currentPage <= 1 ? 0.5 : 1}
              cursor={currentPage <= 1 ? 'not-allowed' : 'pointer'}
            >
              Previous
            </ChakraButton>
            <ChakraButton 
              size="sm" 
              variant="outline" 
              bg="transparent"
              padding="0"
              border="none"
              colorScheme="brand"
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage >= calculatedTotalPages}
              opacity={currentPage >= calculatedTotalPages ? 0.5 : 1}
              cursor={currentPage >= calculatedTotalPages ? 'not-allowed' : 'pointer'}
            >
              Next
            </ChakraButton>
          </Flex>
        </Flex>
      )}
    </Box>
  )
}

export default DataTable