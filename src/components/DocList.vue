<template>
    <div class="document-list">
      <h1>List of Documents</h1>
      <ul>
        <li v-for="document in documents" :key="document.id">
          <a :href="document.url" target="_blank">{{ document.name }}</a>
        </li>
      </ul>
    </div>
  </template>
  


<script>
export default {
  data() {
    return {
      // Static list of documents for demonstration
      documents: [
        { id: 1, name: 'Document 1', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 2, name: 'Document 2', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 3, name: 'Document 3', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      ],
    };
  },
};
</script>


<style scoped>
.document-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  background-color: #fff;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

a {
  text-decoration: none;
  color: #007bff;
}

a:hover {
  text-decoration: underline;
}
</style>
