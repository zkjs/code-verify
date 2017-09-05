module.exports = {
  apps: [
	{
	  name: "myapp",
	  script: "./bin/www",
	  env: {
		"PORT": 3000,
		"NODE_ENV": "development"
	  },
	  env_production: {
		"PORT": 80,
		"NODE_ENV": "production"
	  }
	}
  ]
}
