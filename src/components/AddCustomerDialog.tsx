import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { keyframes } from '@mui/system';

const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onCustomerAdded: (customer: any) => void;
}

const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({
  open,
  onClose,
  onCustomerAdded,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [shakeButton, setShakeButton] = useState(false);

  // Reset fields and close the dialog
  const reset = () => {
    setFirstName('');
    setLastName('');
    setBusinessName('');
    setEmail('');
    onClose();
  };

  const handleCreate = async () => {
    // Validate required fields
    if (!firstName || !lastName || !email || !email.includes('@')) {
      setShakeButton(true);
      setTimeout(() => setShakeButton(false), 500); // Reset shake after animation duration
      return;
    }

    const newCustomer = { firstName, lastName, businessName, email };

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        console.error('Error creating customer');
        return;
      }

      // Handle empty response by checking if there is any text returned
      const text = await response.text();
      const createdCustomer = text ? JSON.parse(text) : newCustomer;

      onCustomerAdded(createdCustomer);
      reset();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={reset} fullWidth maxWidth="sm">
      <DialogTitle>Add Customer</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={reset}>Cancel</Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          sx={{
            // Apply the shake animation if shakeButton is true
            ...(shakeButton && { animation: `${shake} 0.5s ease-in-out` }),
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerDialog;
