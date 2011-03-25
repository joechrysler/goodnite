<%@ page language="java" import="java.io.*, javax.naming.*, javax.naming.directory.*, java.util.*"%>
<%@ include file="config.jsp" %>
<%
//=================================================================+
// Search LDAP for a given user's remaining grace logins.
//   by  Joe Chrysler
//   for Dennis Hughes
//   @   Saginaw Valley State University
//   in  March 2011
//=================================================================+

try {
  // Bucket of Objects  --  thank you Java
  //=================================================================+
    Attributes            attribs;
    String                ldapFilter            = "cn=" + request.getParameter("username");
    DirContext            ldapConnection;
    Hashtable             ldapEnvironment       = new Hashtable();
    SearchControls        ldapSearchHandle      = new SearchControls();
    PrintWriter           output                = response.getWriter();
    NamingEnumeration     people;
    SearchResult          person;
    String                result                = "";
    Attribute             value;


  // Configure the LDAP objects  --  yes, there are more than one
  //=================================================================+
    ldapEnvironment.put(Context.INITIAL_CONTEXT_FACTORY,  "com.sun.jndi.ldap.LdapCtxFactory");
    ldapEnvironment.put(Context.SECURITY_AUTHENTICATION,  "simple");
    ldapEnvironment.put(Context.PROVIDER_URL,             ldapHost);
    ldapEnvironment.put(Context.SECURITY_PRINCIPAL,       ldapUser);
    ldapEnvironment.put(Context.SECURITY_CREDENTIALS,     ldapPass);
    ldapSearchHandle.setSearchScope(SearchControls.SUBTREE_SCOPE);

  
  // Connect to LDAP and Search
  //=================================================================+
    ldapConnection    = new InitialDirContext(ldapEnvironment);
    people            = ldapConnection.search("", ldapFilter, ldapSearchHandle);


  // Parse the search results down to a single number
  //
  //  searching ldap for a username should only ever return one hit
  //=================================================================+
    if (people.hasMore()) {
      person  = (SearchResult) people.next();
      attribs = person.getAttributes();

      if (attribs != null) {
        value   = attribs.get(ldapField);
        result  = value.toString().substring(21, value.toString().length());
        output.println(result);
      }
    }  
} catch (Exception e) {} 
%>
