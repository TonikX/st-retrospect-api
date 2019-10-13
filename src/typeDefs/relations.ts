import { gql } from 'apollo-server-express';

export default gql`
  type Relation {
    """
    Relation's id
    """  
    id: ID!
      
    """
    Person in relation
    """  
    person: Person
      
    """
    Location in relation
    """
    location: Location
      
    """
    Relation type
    """  
    relationType: String
      
    """
    Relation's quote
    """  
    quote: JSON
  }
`;
