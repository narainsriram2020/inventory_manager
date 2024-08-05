'use client'

import React, { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import {
  Box, Modal, Stack, TextField, Typography, Button,
  Container, Paper, List, ListItem, ListItemText,
  ListItemSecondaryAction, Divider
} from "@mui/material";
import { collection, query, getDocs, setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (name) => {
    const docRef = doc(collection(firestore, 'inventory'), name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (name) => {
    const docRef = doc(collection(firestore, 'inventory'), name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Item
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={itemName}
            label="Item Name"
            onChange={(e) => setItemName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              if (itemName.trim()) {
                addItem(itemName.trim());
                setItemName('');
                handleClose();
              }
            }}
          >
            Add Item
          </Button>
        </Box>
      </Modal>

      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'primary.main', p: 3 }}>
          <Typography variant="h4" component="h1" align="center" color="common.white">
            Inventory Dashboard
          </Typography>
        </Box>

        <List sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
          {inventory.map(({ name, quantity }, index) => (
            <React.Fragment key={name}>
              {index > 0 && <Divider />}
              <ListItem sx={{ bgcolor: index % 2 === 0 ? '#f7f7f7' : '#e7e7e7', borderRadius: 1, my: 1 }}>
                <ListItemText
                  primary={name.charAt(0).toUpperCase() + name.slice(1)}
                  secondary={`Quantity: ${quantity}`}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                  secondaryTypographyProps={{ color: 'textSecondary' }}
                />
                <ListItemSecondaryAction>
                  <Button onClick={() => addItem(name)} color="primary" size="small" variant="outlined" sx={{ mx: 1 }}>
                    +
                  </Button>
                  <Button onClick={() => removeItem(name)} color="secondary" size="small" variant="outlined" sx={{ mx: 1 }}>
                    -
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ mt: 2, alignSelf: 'center', fontWeight: 'bold', bgcolor: 'primary.dark' }}
      >
        + Add New Item
      </Button>
    </Container>
  );
}
