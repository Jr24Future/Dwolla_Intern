import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { Customer } from '../pages/index';

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onCustomerAdded: (customer: Customer) => void;
}

const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({
  open,
  onClose,
  onCustomerAdded,
}) => {
  // State variables for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');

  const handleSubmit = async () => {
    const newCustomer = { firstName, lastName, email, businessName };
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });
      if (response.ok) {
        const addedCustomer = await response.json();
        onCustomerAdded(addedCustomer);
        // Reset form and close dialog
        setFirstName('');
        setLastName('');
        setEmail('');
        setBusinessName('');
        onClose();
      } else {
        console.error('Error adding customer');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Customer</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Business Name"
          type="text"
          fullWidth
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerDialog;
