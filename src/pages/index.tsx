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

// Define the Customer type and its collection
export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  businessName?: string;
};

export type Customers = Customer[];

// Define the error shape returned by our API
export type ApiError = {
  code: string;
  message: string;
};

const Home = () => {
  // Define a fetcher function for use with SWR
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) throw body;
    return body;
  };

  // Fetch the list of customers using SWR
  const { data: customers, error, isLoading, mutate } = useSWR<Customers, ApiError>(
    '/api/customers',
    fetcher
  );

  // State to control whether the "Add Customer" dialog is open
  const [dialogOpen, setDialogOpen] = useState(false);

  // Callback to update the customer list when a new customer is added
  const handleCustomerAdded = (newCustomer: Customer) => {
    if (customers) {
      // Append the new customer to the existing list without re-fetching data
      mutate([...customers, newCustomer], false);
    }
  };

  // Safely compute the total number of customers
  const totalCustomers = customers?.length || 0;

  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
        <Container sx={{ py: 4 }}>
          {/* Use a Paper component to wrap the header and table for a unified look */}
          <Paper sx={{ p: 2 }}>
            {/* Top Bar: Displays total customers and the "Add Customer" button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">
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

            {/* Display loading and error messages */}
            {isLoading && <Typography>Loading...</Typography>}
            {error && (
              <Typography color="error">
                Error: {error.message}
              </Typography>
            )}

            {/* Render the customers table when data is available */}
            {customers && (
              <TableContainer>
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
          </Paper>

          {/* Render the "Add Customer" dialog */}
          <AddCustomerDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onCustomerAdded={handleCustomerAdded}
          />
        </Container>
      </main>
    </>
  );
};

export default Home;
