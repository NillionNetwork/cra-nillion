import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Container,
  SelectChangeEvent,
} from '@mui/material';

interface FormComponentProps {
  setData: (data: any) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({ setData }) => {
  const labels = [
    'area',
    'bedrooms',
    'bathrooms',
    'stories',
    'mainroad',
    'guestroom',
    'basement',
    'hotwaterheating',
    'airconditioning',
    'parking',
    'prefarea',
    'furnishingstatus',
  ];

  const initialState: { [key: string]: string | number } = {
    my_input_0: 0,
    my_input_1: 0,
    my_input_2: 0,
    my_input_3: 0,
    my_input_4: 0,
    my_input_5: 0,
    my_input_6: 0,
    my_input_7: 0,
    my_input_8: 0,
    my_input_9: 0,
    my_input_10: 0,
    my_input_11: 0,
  };

  const [formData, setFormData] = useState<{ [key: string]: string | number }>(
    initialState
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert string values to numbers where appropriate
    const parsedFormData = { ...formData };
    Object.keys(parsedFormData).forEach((key) => {
      if (!isNaN(Number(parsedFormData[key]))) {
        parsedFormData[key] = Number(parsedFormData[key]);
      }
    });
    setData(parsedFormData);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {labels.map((label, index) => {
          const inputName = `my_input_${index}`;
          const isNumberInput = [
            'area',
            'bedrooms',
            'bathrooms',
            'stories',
            'parking',
          ].includes(label);
          const isSelectInput = [
            'mainroad',
            'guestroom',
            'basement',
            'hotwaterheating',
            'airconditioning',
            'prefarea',
            'furnishingstatus',
          ].includes(label);

          return (
            <div key={index}>
              {isNumberInput ? (
                <TextField
                  type="number"
                  id={inputName}
                  name={inputName}
                  label={label}
                  value={formData[inputName]}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 0 }}
                />
              ) : isSelectInput ? (
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id={`${inputName}-label`}>{label}</InputLabel>
                  <Select
                    labelId={`${inputName}-label`}
                    id={inputName}
                    name={inputName}
                    value={formData[inputName]}
                    onChange={handleSelectChange}
                  >
                    {label === 'furnishingstatus'
                      ? [
                          <MenuItem key={0} value={0}>
                            unfurnished
                          </MenuItem>,
                          <MenuItem key={1} value={1}>
                            semi-furnished
                          </MenuItem>,
                          <MenuItem key={2} value={2}>
                            furnished
                          </MenuItem>,
                        ]
                      : [
                          <MenuItem key={0} value={0}>
                            no
                          </MenuItem>,
                          <MenuItem key={1} value={1}>
                            yes
                          </MenuItem>,
                        ]}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  id={inputName}
                  name={inputName}
                  label={label}
                  value={formData[inputName]}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  margin="normal"
                />
              )}
            </div>
          );
        })}
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default FormComponent;
