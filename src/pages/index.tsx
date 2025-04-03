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
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) throw body;
    return body;
  };

  // Fetch customers with SWR
  const { data: customers, error, isLoading, mutate } = useSWR<Customers, ApiError>(
    '/api/customers',
    fetcher
  );

  // Dialog open/close state
  const [dialogOpen, setDialogOpen] = useState(false);

  // Callback after adding a customer
  const handleCustomerAdded = (newCustomer: Customer) => {
    if (customers) {
      // Append new customer to the local list
      mutate([...customers, newCustomer], false);
    }
  };

  // Count customers safely
  const totalCustomers = customers?.length || 0;

  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
        <Container sx={{ py: 4 }}>
          {/* Wrap everything in one Paper so the heading, button, and table share the same background */}
          <Paper sx={{ p: 2 }}>
            {/* Top Bar: Heading + Add Button */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
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

            {/* Loading and Error States */}
            {isLoading && <Typography>Loading...</Typography>}
            {error && (
              <Typography color="error">
                Error: {error.message}
              </Typography>
            )}

            {/* Customers Table */}
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

          {/* Dialog for Adding New Customer */}
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
