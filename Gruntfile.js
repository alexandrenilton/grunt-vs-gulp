module.exports = function (grunt) {
	grunt.initConfig({

		clean: {
			temp: ['dist/js/libs.js', 'dist/js/libss.min.js', 'dist/js/scripts.js', 'dist/js/scripts.min.js'], // apagar no final do projeto os js intermediários
			all: ['dist/']  // Apagar no inicio do grunt
		},

		jshint: {
			dist: {
				src: ['js/**/*.js']
			}
		},
		
		concat: {
			scripts: {  //apenas js criados no projetos
				src: [
					'js/**/*.js', //Js proprios, feitos para o proejto
					'libs/**/*.js'
				], //libs eh um pacote com libs proprias (frameworks) 
				dest: 'dist/js/scripts.js'
			},
			libs: {
				src: [
					'bower_components/angular/angular.min.js',
					'bower_components/angular-routes/angular-routes.min.js',
					'bower_components/angular-messages/angular-messages.min.js'
				],
				dest: 'dist/js/libs.js'
			},

			all: { //juntar os arquivos libs.min.js e scripts.min.js no all.min.js
				src: ['dist/js/libs.min.js', 'dist/js/scripts.min.js'],
				dest: 'dist/js/all.min.js'
			}
		},

		uglify: {
			scripts: {
				src: ['dist/js/scripts.js'],
				dest: 'dist/js/scripts.min.js'
			}
		},

		cssmin: {
			all: {
				src: [
					'bower_components/bootstrap/dist/css/bootstrap.min.css',
					'css/**/*.css'
				],
				dest: 'dist/css/styles.min.css'
			}
		},

		// ver a documentaçao do htmlmin pois ele tem opcoes para concaternar e remover espaços, ver tag options
		htmlmin: {  
			options: {
				removeComments: true,
				collapseWhitespace: true
			},
			
			views: {
				expand: true, //para ele expandir, fazer uma busca recursiva
				cwd: 'view/', //direitou onde ele vai atuar
				src: ['*.html'], //padrão de arquivos que ele vai procurar para aplicar a regra
				dest: 'dist/view' // diretório destino onde os arquivos min vao ficar, 1 pra cada html
			}
		},

		copy: {
			all: {
				src: 'index-prod.html',
				dest: 'dist/index.html'
			}
		}
	});

	//Carrega o JSHint um plugin do Grunt q verifica a qualidade do código
	grunt.loadNpmTasks('grunt-contrib-jshint');
	//Carrega o Concat uim plugin do Grunt para concatenar os codigos
	grunt.loadNpmTasks('grunt-contrib-concat');
	//Carrega o uglify, para mimificar
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//Carrega o CSS MIn
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	//Carrega o html min
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	//limpar arquivos intermediarios, e temporarios
	grunt.loadNpmTasks('grunt-contrib-clean');
	//copiar o arquivo final para o diretório correto
	grunt.loadNpmTasks('grunt-contrib-copy');

	
	/* antes era apenas: grunt.registerTask('default', []); Quando colocamos o jshint dentro do [], 
	   eh o mesmo que dizer que default vai executar todos as tasks dentro do [], 
		 nesse caso somente a jshint, poderiam tem mais (separados por virgulas) */
	/* grunt.registerTaks eh que vai ditar as regras do concat */
	grunt.registerTask('prod', ['clean:all',
															'jshint', 
															'concat:scripts', 
															'uglify', 
															'concat:libs', 
															'concat:all', 
															'cssmin', 
															'htmlmin',
															'copy',
															'clean:temp'
														]);

}