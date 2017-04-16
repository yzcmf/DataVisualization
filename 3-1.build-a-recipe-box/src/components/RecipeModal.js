import React from 'react';
import { Button, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const NewRecipeForm = ({newRecipe, handleFormNameChange, handleFormIngredientsChange}) =>
  <form>
    <FormGroup controlId="recipeName">
      <ControlLabel>Name</ControlLabel>
      <FormControl name="name"
                   type="text"
                   value={newRecipe.name}
                   onChange={(event) => handleFormNameChange(newRecipe.id, event)} />
    </FormGroup>
    <FormGroup controlId="recipeIngredients">
      <ControlLabel>Ingredients</ControlLabel>
      <FormControl name="ingredients"
                   componentClass="textarea"
                   value={newRecipe.ingredients}
                   placeholder="Enter all the ingredients separated by commas"
                   onChange={(event) => handleFormIngredientsChange(newRecipe.id, event)} />
    </FormGroup>
  </form>

export const NewRecipeModal = ({heading, showModal, hideModal, handleFormSubmit, newRecipe, handleFormNameChange, handleFormIngredientsChange}) =>
  <Modal show={showModal} onHide={hideModal}>
    <Modal.Header closeButton>
      <Modal.Title>{heading}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <NewRecipeForm newRecipe={newRecipe}
                     handleFormNameChange={handleFormNameChange}
                     handleFormIngredientsChange={handleFormIngredientsChange}
      />
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={() => handleFormSubmit(newRecipe.id)}>Submit</Button>
    </Modal.Footer>
  </Modal>