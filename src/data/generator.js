const { faker } = require('@faker-js/faker');

// Generate a random ID (first 8 characters of UUID)
const generateId = () => faker.string.uuid().substring(0, 8);

// Generate a user with optional override properties
const generateUser = (overrides = {}) => {
  return {
    id: generateId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country()
    },
    phone: faker.phone.number(),
    website: faker.internet.url(),
    company: faker.company.name(),
    createdAt: faker.date.past(),
    ...overrides
  };
};

// Generate a post with optional override properties
const generatePost = (overrides = {}) => {
  return {
    id: generateId(),
    userId: generateId(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(3),
    image: faker.image.url(),
    categories: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => faker.word.noun()),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.word.adjective()),
    createdAt: faker.date.past(),
    ...overrides
  };
};

// Generate a comment with optional override properties
const generateComment = (overrides = {}) => {
  return {
    id: generateId(),
    postId: generateId(),
    userId: generateId(),
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
    body: faker.lorem.paragraph(),
    createdAt: faker.date.past(),
    ...overrides
  };
};

// Generate multiple users
const generateUsers = (count, overrides = {}) => {
  return Array.from({ length: count }, () => generateUser(overrides));
};

// Generate multiple posts
const generatePosts = (count, overrides = {}) => {
  return Array.from({ length: count }, () => generatePost(overrides));
};

// Generate multiple comments
const generateComments = (count, overrides = {}) => {
  return Array.from({ length: count }, () => generateComment(overrides));
};

// Generate custom data based on schema
const generateCustomData = (schema) => {
  const result = {};
  
  for (const [key, type] of Object.entries(schema)) {
    switch (type) {
      case 'id':
        result[key] = generateId();
        break;
      case 'firstName':
        result[key] = faker.person.firstName();
        break;
      case 'lastName':
        result[key] = faker.person.lastName();
        break;
      case 'fullName':
        result[key] = faker.person.fullName();
        break;
      case 'email':
        result[key] = faker.internet.email();
        break;
      case 'phone':
        result[key] = faker.phone.number();
        break;
      case 'address':
        result[key] = faker.location.streetAddress();
        break;
      case 'city':
        result[key] = faker.location.city();
        break;
      case 'country':
        result[key] = faker.location.country();
        break;
      case 'company':
        result[key] = faker.company.name();
        break;
      case 'word':
        result[key] = faker.word.noun();
        break;
      case 'sentence':
        result[key] = faker.lorem.sentence();
        break;
      case 'paragraph':
        result[key] = faker.lorem.paragraph();
        break;
      case 'number':
        result[key] = faker.number.int({ min: 1, max: 1000 });
        break;
      case 'boolean':
        result[key] = faker.datatype.boolean();
        break;
      case 'date':
        result[key] = faker.date.past();
        break;
      case 'image':
        result[key] = faker.image.url();
        break;
      case 'color':
        result[key] = faker.color.rgb();
        break;
      case 'url':
        result[key] = faker.internet.url();
        break;
      default:
        result[key] = 'Unknown type';
    }
  }
  
  return result;
};

module.exports = {
  generateId,
  generateUser,
  generatePost,
  generateComment,
  generateUsers,
  generatePosts,
  generateComments,
  generateCustomData
}; 