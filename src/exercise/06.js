// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonDataView, PokemonForm, PokemonInfoFallback, fetchPokemon} from '../pokemon'

/* class ErrorBoundary extends React.Component{
  state = {error:null}
  static getDerivedStateFromError(error){
    return {error}
  }
  render() {
    const {error} = this.state
    if(error) return <this.props.fallBackComponent error={error}/>
    return this.props.children
  }
} */
import { ErrorBoundary } from 'react-error-boundary';

function PokemonInfo({pokemonName}) {
  /* const [pokemon,setPokemon] = React.useState(null);
  const [error,setError] = React.useState(null);
  const [status,setStatus] = React.useState('idle'); */
  const [state,setState] = React.useState({
    pokemon:null,
    error:null,
    status:'idle',
  });
  const {pokemon,error,status} = state;
  React.useEffect(()=>{
    /* setPokemon(null);
    setError(null);
    setStatus('pending'); */
    setState({pokemon:null,status:'pending'})
    fetchPokemon(pokemonName)
    .then((pokemon)=>{
      /* setPokemon(pokemon);
      setStatus('resolved'); */
      setState({pokemon,status:'resolved'});
    })
    .catch(error => {
      /* setError(error);
      setStatus('rejected'); */
      setState({error,status:'rejected'});
    })
    if(!pokemonName){return}
  },[pokemonName])
  if(status === 'idle'){
    return 'Submit a pokemon'
  }
  if(status === 'pending') return <PokemonInfoFallback name={pokemonName} />
  if(status === 'rejected') throw new Error()
  if (status === 'resolved') return <PokemonDataView pokemon={pokemon} />
}

const FallBackComponent = ({error}) => {
  <div role="alert">
    There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  </div>
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName} fallBackComponent={FallBackComponent}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
