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

// Define a keyframes animation for a shake effect
const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

interface AddCustomerDialogProps {
  open: boolean; // Controls dialog visibility
  onClose: () => void; // Function to close the dialog
  onCustomerAdded: (customer: any) => void; // Callback after a successful customer creation
}

const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({
  open,
  onClose,
  onCustomerAdded,
}) => {
  // States for each form field
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  
  // State to trigger a shake animation on the Create button if validation fails
  const [shakeButton, setShakeButton] = useState(false);

  // Reset the form fields and close the dialog
  const reset = () => {
    setFirstName('');
    setLastName('');
    setBusinessName('');
    setEmail('');
    onClose();
  };

  // Handle form submission for creating a new customer
  const handleCreate = async () => {
    // Validate required fields (first name, last name, email) and email format
    if (!firstName || !lastName || !email || !email.includes('@')) {
      setShakeButton(true);
      // Reset the shake effect after the animation duration
      setTimeout(() => setShakeButton(false), 500);
      return;
    }

    // Construct the new customer object
    const newCustomer = { firstName, lastName, businessName, email };

    try {
      // Send a POST request to create the new customer
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        console.error('Error creating customer');
        return;
      }

      // Handle a potentially empty response by first reading text
      const text = await response.text();
      // If text exists, parse it as JSON; otherwise, use the newCustomer object
      const createdCustomer = text ? JSON.parse(text) : newCustomer;

      // Notify the parent component of the newly added customer
      onCustomerAdded(createdCustomer);
      // Reset the form fields and close the dialog
      reset();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={reset} fullWidth maxWidth="sm">
      {/* Dialog header */}
      <DialogTitle>Add Customer</DialogTitle>
      {/* Dialog content containing the input fields */}
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
      {/* Dialog actions: Cancel and Create buttons */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={reset}>Cancel</Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          sx={{
            // Apply the shake animation if validation fails
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
