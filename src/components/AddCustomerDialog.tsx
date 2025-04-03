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

  // Handle form submission
  const handleCreate = async () => {
    const newCustomer = {
      firstName,
      lastName,
      businessName,
      email,
    };

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        // Handle error
        console.error('Error creating customer');
        return;
      }

      const createdCustomer = await response.json();
      // Pass the newly created customer back to the parent
      onCustomerAdded(createdCustomer);

      // Reset fields and close dialog
      setFirstName('');
      setLastName('');
      setBusinessName('');
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Customer</DialogTitle>
      <DialogContent>
        {/* Use a Grid to arrange the text fields in rows/columns */}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleCreate}
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerDialog;
