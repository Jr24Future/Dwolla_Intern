import Head from 'next/head';
import useSWR from 'swr';
import { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  Container,
} from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import AddCustomerDialog from '../components/AddCustomerDialog';

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  businessName?: string;
};

export type Customers = Customer[];

export type ApiError = {
  code: string;
  message: string;
};

const Home = () => {
  // SWR fetcher
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) throw body;
    return body;
  };

  // Use SWR to fetch the customer list
  const { data: customers, error, isLoading, mutate } = useSWR<Customers, ApiError>(
    '/api/customers',
    fetcher
  );

  // State to handle the Add Customer dialog
  const [dialogOpen, setDialogOpen] = useState(false);

  // Callback when a new customer is added
  const handleCustomerAdded = (newCustomer: Customer) => {
    // Update SWR cache (option 1: mutate with new data appended)
    if (customers) {
      mutate([...customers, newCustomer], false);
    }
    // Option 2: simply call mutate() to re-fetch
  };

  // Safely get the number of customers
  const totalCustomers = customers?.length || 0;

  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
        <Container sx={{ py: 4 }}>
          {/* Top Section: Title + Add Button */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h6" component="h1">
              {totalCustomers} Customers
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => setDialogOpen(true)}
            >
              Add Customer
            </Button>
          </Box>

          {/* Loading and Error States */}
          {isLoading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">Error: {error.message}</Typography>}

          {/* Customers Table */}
          {customers && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.email}>
                      <TableCell>
                        {customer.firstName} {customer.lastName}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>

        {/* Dialog for Adding a New Customer */}
        <AddCustomerDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onCustomerAdded={handleCustomerAdded}
        />
      </main>
    </>
  );
};

export default Home;
