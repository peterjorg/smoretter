var chai = require("chai")
var request = require("request")
var mongoose = require("mongoose")
var User = require("../models/user.js")
var Api = require("../api.js")
var app = require('../app.js');

describe("DemoApp Functionality", function() {
  describe("Login route", function() {
    it("returns status 200", function(done) {
      
      var url = "http://192.168.99.100/login";
      
      request(url, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(200);
        done();
      });
    });
   });
  
   describe("Register route", function() {
    it("returns status 200", function(done) {
      
      var url = "http://192.168.99.100/register";
      
      request(url, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
  
    describe("Home route", function() {
    it("returns status 200", function(done) {
      
      var url = "http://192.168.99.100/";
      
      request(url, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
  
  describe("Users model", function() {
    it("correctly named", function() {
      chai.expect(User.modelName).to.equal("User");
    }); 
  });
  
  describe("API layer", function() {
    it("username set correctly", function() {
        var u = Api.createUser("peterj");
        chai.expect(u.username).to.equal("peterj");
    });
    
    it("password field is empty", function() {
      var u = Api.createUser("peterj");
      chai.expect(u.password).not.to.equal("");
    });
  });
});