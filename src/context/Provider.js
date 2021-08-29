import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Context from './Context';
import { fetchMeals } from '../services/requestMealsAPI';
import { fetchDrinks } from '../services/requestDrinksAPI';

function Provider({ children }) {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState({
    disabled: true,
  });
  const [meals, setMeals] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [recipeType, setRecipeType] = useState('meals');

  useEffect(() => {
    async function fetchAPI() {
      const responseMeals = await fetchMeals();
      setMeals(responseMeals);
      const responseCocktails = await fetchDrinks();
      setCocktails(responseCocktails);
    }
    fetchAPI();
  }, []);

  const validButton = () => {
    const { email, password } = user;
    const { disabled } = buttonDisabled;
    const rgeex = /(.*)@(.*).com/;
    const magicNumber = 6;
    if (rgeex.test(email) && (password.length >= magicNumber)) {
      setButtonDisabled({
        disabled: false,
      });
    }
    return disabled;
  };
  const history = useHistory();

  const handleInputs = ({ target }) => {
    const { name, value } = target;
    setUser({
      ...user,
      [name]: value,
    });
    validButton();
    const inputEmail = document.getElementById('email-input');
    localStorage.setItem('mealsToken', 1);
    localStorage.setItem('cocktailsToken', 1);
    localStorage.setItem('user', JSON.stringify({ email: `${inputEmail.value}` }));
  };

  const handleClick = () => {
    history.push('/comidas');
  };

  const context = {
    buttonDisabled,
    handleInputs,
    user,
    handleClick,
    cocktails,
    setCocktails,
    meals,
    setMeals,
    recipeType,
    setRecipeType,
  };

  return (
    <Context.Provider value={ context }>
      { children }
    </Context.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
}.isRequired;

export default Provider;
