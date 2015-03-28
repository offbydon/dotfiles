var fs = require("fs-plus");
var path = require("path");
var temp = require("temp");
var _ = require("lodash");

describe("Build", function () {
  "use strict";

  var goodMakefile = __dirname + "/fixture/Makefile.good";
  var badMakefile = __dirname + "/fixture/Makefile.bad";
  var longMakefile = __dirname + "/fixture/Makefile.long";
  var escapeMakefile = __dirname + "/fixture/Makefile.escape";
  var goodGruntfile = __dirname + "/fixture/Gruntfile.js";
  var goodGulpfile = __dirname + "/fixture/gulpfile.js";
  var goodNodefile = __dirname + "/fixture/package.json.node";
  var goodAtomfile = __dirname + "/fixture/package.json.atom";
  var badPackageJsonfile = __dirname + "/fixture/package.json.noengine";
  var goodAtomBuildfile = __dirname + "/fixture/.atom-build.json";
  var shellAtomBuildfile = __dirname + "/fixture/.atom-build.shell.json";
  var replaceAtomBuildFile = __dirname + "/fixture/.atom-build.replace.json";
  var shFalseAtomBuildFile = __dirname + "/fixture/.atom-build.sh-false.json";
  var shTrueAtomBuildFile = __dirname + "/fixture/.atom-build.sh-true.json";
  var shDefaultAtomBuildFile = __dirname + "/fixture/.atom-build.sh-default.json";
  var syntaxErrorAtomBuildFile = __dirname + "/fixture/.atom-build.syntax-error.json";
  var errorMatchAtomBuildFile = __dirname + "/fixture/.atom-build.error-match.json";
  var errorMatchNLCAtomBuildFile = __dirname + "/fixture/.atom-build.error-match-no-line-col.json";

  var directory = null;
  var workspaceElement = null;

  temp.track();

  beforeEach(function () {
    directory = fs.realpathSync(temp.mkdirSync({ prefix: "atom-build-spec-" })) + "/";
    atom.project.setPaths([directory]);

    atom.config.set("build.buildOnSave", false);
    atom.config.set("build.keepVisible", false);
    atom.config.set("build.saveOnBuild", false);

    // Set up dependencies
    fs.copySync(path.join(__dirname, "fixture", "node_modules"), path.join(directory, "node_modules"));

    // Set up grunt
    var binGrunt = path.join(directory, "node_modules", ".bin", "grunt");
    var realGrunt = path.join(directory, "node_modules", "grunt-cli", "bin", "grunt");
    fs.unlinkSync(binGrunt);
    fs.chmodSync(realGrunt, parseInt("0700", 8));
    fs.symlinkSync(realGrunt, binGrunt);

    // Set up gulp
    var binGulp = path.join(directory, "node_modules", ".bin", "gulp");
    var realGulp = path.join(directory, "node_modules", "gulp", "bin", "gulp.js");
    fs.unlinkSync(binGulp);
    fs.chmodSync(realGulp, parseInt("0700", 8));
    fs.symlinkSync(realGulp, binGulp);

    jasmine.unspy(window, "setTimeout");
    jasmine.unspy(window, "clearTimeout");

    runs(function () {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
    });

    waitsForPromise(function () {
      return atom.packages.activatePackage("build");
    });
  });

  afterEach(function () {
    fs.removeSync(directory);
  });

  describe("when package is activated", function () {
    it("should not show build window if keepVisible is false", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();
    });
  });

  describe("when build is triggered twice", function () {
    it("should not leave multiple panels behind", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      atom.config.set("build.keepVisible", true);

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelectorAll(".bottom.tool-panel.panel-bottom").length).toBe(1);
        atom.commands.dispatch(workspaceElement, "build:trigger");
      });

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelectorAll(".bottom.tool-panel.panel-bottom").length).toBe(1);
      });
    });
  });

  describe("when build is triggered with Makefile", function () {
    it("should not show the build window if no buildfile exists", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      atom.commands.dispatch(workspaceElement, "build:trigger");

      runs(function () {
        expect(workspaceElement.querySelector(".build")).not.toExist();
      });
    });

    it("should show the build window if buildfile exists", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Surprising is the passing of time\nbut not so, as the time of passing/);
      });
    });

    it("should show build failed if build fails", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(badMakefile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("error");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Very bad\.\.\./);
      });
    });

    it("should cancel build when stopping it, and remove when stopping again", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(longMakefile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      // Let build run for one second before we terminate it
      waits(1000);

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Building, this will take some time.../);
        atom.commands.dispatch(workspaceElement, "build:stop");
      });

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("error");
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, "build:stop");
      });

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").textContent == "Aborted!";
      });
    });
  });

  describe("when build is triggered with grunt file", function () {
    it("should show the build window", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "Gruntfile.js", fs.readFileSync(goodGruntfile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Surprising is the passing of time. But not so, as the time of passing/);
      });
    });
  });

  describe("when build is triggered with package.json file", function () {
    it("should show the build window if it is node engine", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "package.json", fs.readFileSync(goodNodefile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/^Executing: npm/);
      });
    });

    it("should show the build window if it is atom engine", function () {
      if (process.env.TRAVIS) {
        return;
      }

      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "package.json", fs.readFileSync(goodAtomfile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      }, "build to be successful", 10000);

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/^Executing: apm/);
      });
    });

    it("should not do anything if engines are not available in the file", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "package.json", fs.readFileSync(badPackageJsonfile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waits(1000);

      runs(function () {
        expect(workspaceElement.querySelector(".build")).not.toExist();
      });
    });
  });

  describe("when custom .atom-build.json is available", function () {
    it("should show the build window", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + ".atom-build.json", fs.readFileSync(goodAtomBuildfile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/"cmd": "dd"/);
      });
    });

    it("should be possible to exec shell commands with wildcard expansion", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + ".atom-build.json", fs.readFileSync(shellAtomBuildfile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Good news, everyone!/);
      });
    });

    it("should show sh message if sh is true", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + ".atom-build.json", fs.readFileSync(shTrueAtomBuildFile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Executing with sh:/);
      });
    });

    it("should not show sh message if sh is false", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + ".atom-build.json", fs.readFileSync(shFalseAtomBuildFile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Executing:/);
      });
    });

    it("should show sh message if sh is unspecified", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + ".atom-build.json", fs.readFileSync(shDefaultAtomBuildFile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Executing with sh:/);
      });
    });

    it("should show graphical error message if build-file contains syntax errors", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + ".atom-build.json", fs.readFileSync(syntaxErrorAtomBuildFile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("error");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Unexpected token t/);
        expect(workspaceElement.querySelector(".build .title").textContent).toBe("You have a syntax error in your build file.");
      });
    });
  });

  describe("when build is triggered with gulp file", function () {
    it("should show the build window", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "gulpfile.js", fs.readFileSync(goodGulpfile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/gulp built/);
      });
    });
  });

  describe("when multiple build options are available", function () {
    it("should prioritise .atom-build.json over node", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + ".atom-build.json", fs.readFileSync(goodAtomBuildfile));
      fs.writeFileSync(directory + "package.json", fs.readFileSync(goodNodefile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/"cmd": "dd"/);
      });
    });

    it("should prioritise grunt over make", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "Gruntfile.js", fs.readFileSync(goodGruntfile));
      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Running "default" task/);
      });
    });

    it("should prioritise node over grunt", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "Gruntfile.js", fs.readFileSync(goodGruntfile));
      fs.writeFileSync(directory + "package.json", fs.readFileSync(goodNodefile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/^Executing: npm/);
      });
    });

    it("should prioritise atom over grunt", function () {
      if (process.env.TRAVIS) {
        return;
      }
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "Gruntfile.js", fs.readFileSync(goodGruntfile));
      fs.writeFileSync(directory + "package.json", fs.readFileSync(goodAtomfile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      }, "build to be successful", 10000);

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/^Executing: apm/);
      });
    });
  });

  describe("when package.json exists, but without engines and Makefile is present", function () {
    it("(Issue#3) should run Makefile without any npm arguments", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "package.json", fs.readFileSync(badPackageJsonfile));
      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));

      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Surprising is the passing of time\nbut not so, as the time of passing/);
      });
    });
  });

  describe("when replacements are specified in the atom-build.json file", function () {
    it("should replace those with their dynamic value", function () {

      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + ".atom-build.json", fs.readFileSync(replaceAtomBuildFile));

      waitsForPromise(function () {
        return atom.workspace.open(".atom-build.json");
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, "build:trigger");
      });

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        var output = workspaceElement.querySelector(".build .output").textContent;

        expect(output.indexOf("PROJECT_PATH=" + directory.substring(0, -1))).not.toBe(-1);
        expect(output.indexOf("FILE_ACTIVE=" + directory + ".atom-build.json")).not.toBe(-1);
        expect(output.indexOf("FROM_ENV=" + directory + ".atom-build.json")).not.toBe(-1);
        expect(output.indexOf("FILE_ACTIVE_NAME=.atom-build.json")).not.toBe(-1);
        expect(output.indexOf("FILE_ACTIVE_NAME_BASE=.atom-build")).not.toBe(-1);
      });
    });
  });

  describe("when output from build contains HTML characters", function () {
    it("should escape those properly so the output is not garbled or missing", function () {
      expect(workspaceElement.querySelector(".build")).not.toExist();

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(escapeMakefile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").innerHTML).toMatch(/&lt;script type="text\/javascript"&gt;alert\('XSS!'\)&lt;\/script&gt;/);
      });
    });
  });

  describe("when the text editor is modified", function () {
    it("should show the save confirmation", function () {
      expect(workspaceElement.querySelector(".build-confirm")).not.toExist();

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));

      waitsForPromise(function () {
        return atom.workspace.open("Makefile");
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.insertText("hello kansas");
        atom.commands.dispatch(workspaceElement, "build:trigger");
      });

      waitsFor(function () {
        return workspaceElement.querySelector(":focus");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".btn-success:focus")).toExist();
      });
    });

    it("should cancel the confirm window when pressing escape", function () {
      expect(workspaceElement.querySelector(".build-confirm")).not.toExist();

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));

      waitsForPromise(function () {
        return atom.workspace.open("Makefile");
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.insertText("hello kansas");
        atom.commands.dispatch(workspaceElement, "build:trigger");
      });

      waitsFor(function () {
        return workspaceElement.querySelector(":focus");
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, "build:no-confirm");
        expect(workspaceElement.querySelector(".btn-success:focus")).not.toExist();
      });
    });

    it("should not confirm if a TextEditor edits an unsaved file", function () {
      expect(workspaceElement.querySelector(".build-confirm")).not.toExist();

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));

      waitsForPromise(function () {
        return atom.workspace.open("Makefile");
      });

      waitsForPromise(function () {
        return atom.workspace.open();
      });

      runs(function () {
        var editor = _.find(atom.workspace.getTextEditors(), function (textEditor) {
          return "untitled" === textEditor.getTitle();
        });
        editor.insertText("Just some temporary place to write stuff");
        atom.commands.dispatch(workspaceElement, "build:trigger");
      });

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Surprising is the passing of time\nbut not so, as the time of passing/);
      });
    });

    it("should save and build when selecting save and build", function () {
      expect(workspaceElement.querySelector(".build-confirm")).not.toExist();

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));

      waitsForPromise(function () {
        return atom.workspace.open("Makefile");
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.insertText("dummy:\n\techo kansas\n");
        atom.commands.dispatch(workspaceElement, "build:trigger");
      });

      waitsFor(function () {
        return workspaceElement.querySelector(":focus");
      });

      runs(function () {
        workspaceElement.querySelector(":focus").click();
      });

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").innerHTML).toMatch(/kansas/);
        expect(!editor.isModified());
      });
    });

    it("should build but not save when opting so", function () {
      expect(workspaceElement.querySelector(".build-confirm")).not.toExist();

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));

      waitsForPromise(function () {
        return atom.workspace.open("Makefile");
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.insertText("dummy:\n\techo kansas\n");
        atom.commands.dispatch(workspaceElement, "build:trigger");
      });

      waitsFor(function () {
        return workspaceElement.querySelector(":focus");
      });

      runs(function () {
        workspaceElement.querySelector("button[click=\"confirmWithoutSave\"]").click();
      });

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").innerHTML).not.toMatch(/kansas/);
        expect(editor.isModified());
      });
    });

    it("should do nothing when cancelling", function () {
      expect(workspaceElement.querySelector(".build-confirm")).not.toExist();

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));

      waitsForPromise(function () {
        return atom.workspace.open("Makefile");
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.insertText("dummy:\n\techo kansas\n");
        atom.commands.dispatch(workspaceElement, "build:trigger");
      });

      waitsFor(function () {
        return workspaceElement.querySelector(":focus");
      });

      runs(function () {
        workspaceElement.querySelector("button[click=\"cancel\"]").click();
      });

      waits(2);

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        expect(workspaceElement.querySelector(".build")).not.toExist();
        expect(editor.isModified());
      });
    });
  });

  describe("when the text editor is saved", function () {
    it("should build when buildOnSave is true", function () {
      atom.config.set("build.buildOnSave", true);

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));

      waitsForPromise(function () {
        return atom.workspace.open("dummy");
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.save();
      });

      waitsFor(function () {
        expect(workspaceElement.querySelector(".build ")).toExist();
        return workspaceElement.querySelector(".build .title").classList.contains("success");
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).toExist();
        expect(workspaceElement.querySelector(".build .output").textContent).toMatch(/Surprising is the passing of time\nbut not so, as the time of passing/);
      });
    });

    it("should not build when buildOnSave is false", function () {
      atom.config.set("build.buildOnSave", false);

      fs.writeFileSync(directory + "Makefile", fs.readFileSync(goodMakefile));

      waitsForPromise(function () {
        return atom.workspace.open("dummy");
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.save();
      });

      runs(function () {
        expect(workspaceElement.querySelector(".build")).not.toExist();
      });
    });
  });

  describe("when output is captured to show editor on error", function () {
    it("should place the line and column on error in correct file", function () {
      expect(workspaceElement.querySelector(".build-confirm")).not.toExist();

      fs.writeFileSync(directory + ".atom-build.json", fs.readFileSync(errorMatchAtomBuildFile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("error");
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, "build:error-match");
      });

      waitsFor(function () {
        return atom.workspace.getActiveTextEditor();
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        var bufferPosition = editor.getCursorBufferPosition();
        expect(editor.getTitle()).toEqual(".atom-build.json");
        expect(bufferPosition.row).toEqual(2);
        expect(bufferPosition.column).toEqual(7);
      });
    });

    it("should open just the file if line and column is not available", function () {
      expect(workspaceElement.querySelector(".build-confirm")).not.toExist();

      fs.writeFileSync(directory + ".atom-build.json", fs.readFileSync(errorMatchNLCAtomBuildFile));
      atom.commands.dispatch(workspaceElement, "build:trigger");

      waitsFor(function () {
        return workspaceElement.querySelector(".build .title").classList.contains("error");
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, "build:error-match");
      });

      waitsFor(function () {
        return atom.workspace.getActiveTextEditor();
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        expect(editor.getTitle()).toEqual(".atom-build.json");
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL29wcy8uYXRvbS9wYWNrYWdlcy9idWlsZC9zcGVjL2J1aWxkLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzVCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUUxQixRQUFRLENBQUMsT0FBTyxFQUFFLFlBQVc7QUFDM0IsY0FBWSxDQUFDOztBQUViLE1BQUksWUFBWSxHQUFHLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQztBQUN4RCxNQUFJLFdBQVcsR0FBRyxTQUFTLEdBQUcsdUJBQXVCLENBQUM7QUFDdEQsTUFBSSxZQUFZLEdBQUcsU0FBUyxHQUFHLHdCQUF3QixDQUFDO0FBQ3hELE1BQUksY0FBYyxHQUFHLFNBQVMsR0FBRywwQkFBMEIsQ0FBQztBQUM1RCxNQUFJLGFBQWEsR0FBRyxTQUFTLEdBQUcsdUJBQXVCLENBQUM7QUFDeEQsTUFBSSxZQUFZLEdBQUcsU0FBUyxHQUFHLHNCQUFzQixDQUFDO0FBQ3RELE1BQUksWUFBWSxHQUFHLFNBQVMsR0FBRyw0QkFBNEIsQ0FBQztBQUM1RCxNQUFJLFlBQVksR0FBRyxTQUFTLEdBQUcsNEJBQTRCLENBQUM7QUFDNUQsTUFBSSxrQkFBa0IsR0FBRyxTQUFTLEdBQUcsZ0NBQWdDLENBQUM7QUFDdEUsTUFBSSxpQkFBaUIsR0FBRyxTQUFTLEdBQUcsMkJBQTJCLENBQUM7QUFDaEUsTUFBSSxrQkFBa0IsR0FBRyxTQUFTLEdBQUcsaUNBQWlDLENBQUM7QUFDdkUsTUFBSSxvQkFBb0IsR0FBRyxTQUFTLEdBQUcsbUNBQW1DLENBQUM7QUFDM0UsTUFBSSxvQkFBb0IsR0FBRyxTQUFTLEdBQUcsb0NBQW9DLENBQUM7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Q0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO09BQ3ZELENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9vcHMvLmF0b20vcGFja2FnZXMvYnVpbGQvc3BlYy9idWlsZC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGZzID0gcmVxdWlyZSgnZnMtcGx1cycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgdGVtcCA9IHJlcXVpcmUoJ3RlbXAnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmRlc2NyaWJlKCdCdWlsZCcsIGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGdvb2RNYWtlZmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS9NYWtlZmlsZS5nb29kJztcbiAgdmFyIGJhZE1ha2VmaWxlID0gX19kaXJuYW1lICsgJy9maXh0dXJlL01ha2VmaWxlLmJhZCc7XG4gIHZhciBsb25nTWFrZWZpbGUgPSBfX2Rpcm5hbWUgKyAnL2ZpeHR1cmUvTWFrZWZpbGUubG9uZyc7XG4gIHZhciBlc2NhcGVNYWtlZmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS9NYWtlZmlsZS5lc2NhcGUnO1xuICB2YXIgZ29vZEdydW50ZmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS9HcnVudGZpbGUuanMnO1xuICB2YXIgZ29vZEd1bHBmaWxlID0gX19kaXJuYW1lICsgJy9maXh0dXJlL2d1bHBmaWxlLmpzJztcbiAgdmFyIGdvb2ROb2RlZmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS9wYWNrYWdlLmpzb24ubm9kZSc7XG4gIHZhciBnb29kQXRvbWZpbGUgPSBfX2Rpcm5hbWUgKyAnL2ZpeHR1cmUvcGFja2FnZS5qc29uLmF0b20nO1xuICB2YXIgYmFkUGFja2FnZUpzb25maWxlID0gX19kaXJuYW1lICsgJy9maXh0dXJlL3BhY2thZ2UuanNvbi5ub2VuZ2luZSc7XG4gIHZhciBnb29kQXRvbUJ1aWxkZmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS8uYXRvbS1idWlsZC5qc29uJztcbiAgdmFyIHNoZWxsQXRvbUJ1aWxkZmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS8uYXRvbS1idWlsZC5zaGVsbC5qc29uJztcbiAgdmFyIHJlcGxhY2VBdG9tQnVpbGRGaWxlID0gX19kaXJuYW1lICsgJy9maXh0dXJlLy5hdG9tLWJ1aWxkLnJlcGxhY2UuanNvbic7XG4gIHZhciBzaEZhbHNlQXRvbUJ1aWxkRmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS8uYXRvbS1idWlsZC5zaC1mYWxzZS5qc29uJztcbiAgdmFyIHNoVHJ1ZUF0b21CdWlsZEZpbGUgPSBfX2Rpcm5hbWUgKyAnL2ZpeHR1cmUvLmF0b20tYnVpbGQuc2gtdHJ1ZS5qc29uJztcbiAgdmFyIHNoRGVmYXVsdEF0b21CdWlsZEZpbGUgPSBfX2Rpcm5hbWUgKyAnL2ZpeHR1cmUvLmF0b20tYnVpbGQuc2gtZGVmYXVsdC5qc29uJztcbiAgdmFyIHN5bnRheEVycm9yQXRvbUJ1aWxkRmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS8uYXRvbS1idWlsZC5zeW50YXgtZXJyb3IuanNvbic7XG4gIHZhciBlcnJvck1hdGNoQXRvbUJ1aWxkRmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS8uYXRvbS1idWlsZC5lcnJvci1tYXRjaC5qc29uJztcbiAgdmFyIGVycm9yTWF0Y2hOTENBdG9tQnVpbGRGaWxlID0gX19kaXJuYW1lICsgJy9maXh0dXJlLy5hdG9tLWJ1aWxkLmVycm9yLW1hdGNoLW5vLWxpbmUtY29sLmpzb24nO1xuXG4gIHZhciBkaXJlY3RvcnkgPSBudWxsO1xuICB2YXIgd29ya3NwYWNlRWxlbWVudCA9IG51bGw7XG5cbiAgdGVtcC50cmFjaygpO1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgZGlyZWN0b3J5ID0gZnMucmVhbHBhdGhTeW5jKHRlbXAubWtkaXJTeW5jKHsgcHJlZml4OiAnYXRvbS1idWlsZC1zcGVjLScgfSkpICsgJy8nO1xuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbIGRpcmVjdG9yeSBdKTtcblxuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQuYnVpbGRPblNhdmUnLCBmYWxzZSk7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5rZWVwVmlzaWJsZScsIGZhbHNlKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnNhdmVPbkJ1aWxkJywgZmFsc2UpO1xuXG4gICAgLy8gU2V0IHVwIGRlcGVuZGVuY2llc1xuICAgIGZzLmNvcHlTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlJywgJ25vZGVfbW9kdWxlcycpLCBwYXRoLmpvaW4oZGlyZWN0b3J5LCAnbm9kZV9tb2R1bGVzJykpO1xuXG4gICAgLy8gU2V0IHVwIGdydW50XG4gICAgdmFyIGJpbkdydW50ID0gcGF0aC5qb2luKGRpcmVjdG9yeSwgJ25vZGVfbW9kdWxlcycsICcuYmluJywgJ2dydW50Jyk7XG4gICAgdmFyIHJlYWxHcnVudCA9IHBhdGguam9pbihkaXJlY3RvcnksICdub2RlX21vZHVsZXMnLCAnZ3J1bnQtY2xpJywgJ2JpbicsICdncnVudCcpO1xuICAgIGZzLnVubGlua1N5bmMoYmluR3J1bnQpO1xuICAgIGZzLmNobW9kU3luYyhyZWFsR3J1bnQsIHBhcnNlSW50KCcwNzAwJywgOCkpO1xuICAgIGZzLnN5bWxpbmtTeW5jKHJlYWxHcnVudCwgYmluR3J1bnQpO1xuXG4gICAgLy8gU2V0IHVwIGd1bHBcbiAgICB2YXIgYmluR3VscCA9IHBhdGguam9pbihkaXJlY3RvcnksICdub2RlX21vZHVsZXMnLCAnLmJpbicsICdndWxwJyk7XG4gICAgdmFyIHJlYWxHdWxwID0gcGF0aC5qb2luKGRpcmVjdG9yeSwgJ25vZGVfbW9kdWxlcycsICdndWxwJywgJ2JpbicsICdndWxwLmpzJyk7XG4gICAgZnMudW5saW5rU3luYyhiaW5HdWxwKTtcbiAgICBmcy5jaG1vZFN5bmMocmVhbEd1bHAsIHBhcnNlSW50KCcwNzAwJywgOCkpO1xuICAgIGZzLnN5bWxpbmtTeW5jKHJlYWxHdWxwLCBiaW5HdWxwKTtcblxuICAgIGphc21pbmUudW5zcHkod2luZG93LCAnc2V0VGltZW91dCcpO1xuICAgIGphc21pbmUudW5zcHkod2luZG93LCAnY2xlYXJUaW1lb3V0Jyk7XG5cbiAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdidWlsZCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgZnMucmVtb3ZlU3luYyhkaXJlY3RvcnkpO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiBwYWNrYWdlIGlzIGFjdGl2YXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgbm90IHNob3cgYnVpbGQgd2luZG93IGlmIGtlZXBWaXNpYmxlIGlzIGZhbHNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gYnVpbGQgaXMgdHJpZ2dlcmVkIHR3aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBub3QgbGVhdmUgbXVsdGlwbGUgcGFuZWxzIGJlaGluZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQua2VlcFZpc2libGUnLCB0cnVlKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnTWFrZWZpbGUnLCBmcy5yZWFkRmlsZVN5bmMoZ29vZE1ha2VmaWxlKSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvdHRvbS50b29sLXBhbmVsLnBhbmVsLWJvdHRvbScpLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvdHRvbS50b29sLXBhbmVsLnBhbmVsLWJvdHRvbScpLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiBidWlsZCBpcyB0cmlnZ2VyZWQgd2l0aCBNYWtlZmlsZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgbm90IHNob3cgdGhlIGJ1aWxkIHdpbmRvdyBpZiBubyBidWlsZGZpbGUgZXhpc3RzJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHRoZSBidWlsZCB3aW5kb3cgaWYgYnVpbGRmaWxlIGV4aXN0cycsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGdvb2RNYWtlZmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL1N1cnByaXNpbmcgaXMgdGhlIHBhc3Npbmcgb2YgdGltZVxcbmJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGJ1aWxkIGZhaWxlZCBpZiBidWlsZCBmYWlscycsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGJhZE1ha2VmaWxlKSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdlcnJvcicpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL1ZlcnkgYmFkXFwuXFwuXFwuLyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2FuY2VsIGJ1aWxkIHdoZW4gc3RvcHBpbmcgaXQsIGFuZCByZW1vdmUgd2hlbiBzdG9wcGluZyBhZ2FpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGxvbmdNYWtlZmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICAvLyBMZXQgYnVpbGQgcnVuIGZvciBvbmUgc2Vjb25kIGJlZm9yZSB3ZSB0ZXJtaW5hdGUgaXRcbiAgICAgIHdhaXRzKDEwMDApO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9CdWlsZGluZywgdGhpcyB3aWxsIHRha2Ugc29tZSB0aW1lLi4uLyk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnN0b3AnKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnZXJyb3InKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDpzdG9wJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykudGV4dENvbnRlbnQgPT0gJ0Fib3J0ZWQhJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gYnVpbGQgaXMgdHJpZ2dlcmVkIHdpdGggZ3J1bnQgZmlsZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgc2hvdyB0aGUgYnVpbGQgd2luZG93JywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnR3J1bnRmaWxlLmpzJywgZnMucmVhZEZpbGVTeW5jKGdvb2RHcnVudGZpbGUpKTtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9TdXJwcmlzaW5nIGlzIHRoZSBwYXNzaW5nIG9mIHRpbWUuIEJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiBidWlsZCBpcyB0cmlnZ2VyZWQgd2l0aCBwYWNrYWdlLmpzb24gZmlsZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgc2hvdyB0aGUgYnVpbGQgd2luZG93IGlmIGl0IGlzIG5vZGUgZW5naW5lJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAncGFja2FnZS5qc29uJywgZnMucmVhZEZpbGVTeW5jKGdvb2ROb2RlZmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL15FeGVjdXRpbmc6IG5wbS8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgdGhlIGJ1aWxkIHdpbmRvdyBpZiBpdCBpcyBhdG9tIGVuZ2luZScsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlRSQVZJUykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICdwYWNrYWdlLmpzb24nLCBmcy5yZWFkRmlsZVN5bmMoZ29vZEF0b21maWxlKSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9LCAnYnVpbGQgdG8gYmUgc3VjY2Vzc2Z1bCcsIDEwMDAwKTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvXkV4ZWN1dGluZzogYXBtLyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGRvIGFueXRoaW5nIGlmIGVuZ2luZXMgYXJlIG5vdCBhdmFpbGFibGUgaW4gdGhlIGZpbGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICdwYWNrYWdlLmpzb24nLCBmcy5yZWFkRmlsZVN5bmMoYmFkUGFja2FnZUpzb25maWxlKSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzKDEwMDApO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiBjdXN0b20gLmF0b20tYnVpbGQuanNvbiBpcyBhdmFpbGFibGUnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHNob3cgdGhlIGJ1aWxkIHdpbmRvdycsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBmcy5yZWFkRmlsZVN5bmMoZ29vZEF0b21CdWlsZGZpbGUpKTtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9cImNtZFwiOiBcImRkXCIvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBwb3NzaWJsZSB0byBleGVjIHNoZWxsIGNvbW1hbmRzIHdpdGggd2lsZGNhcmQgZXhwYW5zaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhzaGVsbEF0b21CdWlsZGZpbGUpKTtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9Hb29kIG5ld3MsIGV2ZXJ5b25lIS8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgc2ggbWVzc2FnZSBpZiBzaCBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhzaFRydWVBdG9tQnVpbGRGaWxlKSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvRXhlY3V0aW5nIHdpdGggc2g6Lyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgc2ggbWVzc2FnZSBpZiBzaCBpcyBmYWxzZScsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBmcy5yZWFkRmlsZVN5bmMoc2hGYWxzZUF0b21CdWlsZEZpbGUpKTtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9FeGVjdXRpbmc6Lyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2hvdyBzaCBtZXNzYWdlIGlmIHNoIGlzIHVuc3BlY2lmaWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhzaERlZmF1bHRBdG9tQnVpbGRGaWxlKSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvRXhlY3V0aW5nIHdpdGggc2g6Lyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2hvdyBncmFwaGljYWwgZXJyb3IgbWVzc2FnZSBpZiBidWlsZC1maWxlIGNvbnRhaW5zIHN5bnRheCBlcnJvcnMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgZnMucmVhZEZpbGVTeW5jKHN5bnRheEVycm9yQXRvbUJ1aWxkRmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnZXJyb3InKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9VbmV4cGVjdGVkIHRva2VuIHQvKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLnRleHRDb250ZW50KS50b0JlKCdZb3UgaGF2ZSBhIHN5bnRheCBlcnJvciBpbiB5b3VyIGJ1aWxkIGZpbGUuJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gYnVpbGQgaXMgdHJpZ2dlcmVkIHdpdGggZ3VscCBmaWxlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHRoZSBidWlsZCB3aW5kb3cnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICdndWxwZmlsZS5qcycsIGZzLnJlYWRGaWxlU3luYyhnb29kR3VscGZpbGUpKTtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9ndWxwIGJ1aWx0Lyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gbXVsdGlwbGUgYnVpbGQgb3B0aW9ucyBhcmUgYXZhaWxhYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcmlvcml0aXNlIC5hdG9tLWJ1aWxkLmpzb24gb3ZlciBub2RlJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhnb29kQXRvbUJ1aWxkZmlsZSkpO1xuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAncGFja2FnZS5qc29uJywgZnMucmVhZEZpbGVTeW5jKGdvb2ROb2RlZmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL1wiY21kXCI6IFwiZGRcIi8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByaW9yaXRpc2UgZ3J1bnQgb3ZlciBtYWtlJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnR3J1bnRmaWxlLmpzJywgZnMucmVhZEZpbGVTeW5jKGdvb2RHcnVudGZpbGUpKTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGdvb2RNYWtlZmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL1J1bm5pbmcgXCJkZWZhdWx0XCIgdGFzay8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByaW9yaXRpc2Ugbm9kZSBvdmVyIGdydW50JywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnR3J1bnRmaWxlLmpzJywgZnMucmVhZEZpbGVTeW5jKGdvb2RHcnVudGZpbGUpKTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ3BhY2thZ2UuanNvbicsIGZzLnJlYWRGaWxlU3luYyhnb29kTm9kZWZpbGUpKTtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9eRXhlY3V0aW5nOiBucG0vKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcmlvcml0aXNlIGF0b20gb3ZlciBncnVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlRSQVZJUykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnR3J1bnRmaWxlLmpzJywgZnMucmVhZEZpbGVTeW5jKGdvb2RHcnVudGZpbGUpKTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ3BhY2thZ2UuanNvbicsIGZzLnJlYWRGaWxlU3luYyhnb29kQXRvbWZpbGUpKTtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0sICdidWlsZCB0byBiZSBzdWNjZXNzZnVsJywgMTAwMDApO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9eRXhlY3V0aW5nOiBhcG0vKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiBwYWNrYWdlLmpzb24gZXhpc3RzLCBidXQgd2l0aG91dCBlbmdpbmVzIGFuZCBNYWtlZmlsZSBpcyBwcmVzZW50JywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJyhJc3N1ZSMzKSBzaG91bGQgcnVuIE1ha2VmaWxlIHdpdGhvdXQgYW55IG5wbSBhcmd1bWVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICdwYWNrYWdlLmpzb24nLCBmcy5yZWFkRmlsZVN5bmMoYmFkUGFja2FnZUpzb25maWxlKSk7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICdNYWtlZmlsZScsIGZzLnJlYWRGaWxlU3luYyhnb29kTWFrZWZpbGUpKTtcblxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL1N1cnByaXNpbmcgaXMgdGhlIHBhc3Npbmcgb2YgdGltZVxcbmJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiByZXBsYWNlbWVudHMgYXJlIHNwZWNpZmllZCBpbiB0aGUgYXRvbS1idWlsZC5qc29uIGZpbGUnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHJlcGxhY2UgdGhvc2Ugd2l0aCB0aGVpciBkeW5hbWljIHZhbHVlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgZnMucmVhZEZpbGVTeW5jKHJlcGxhY2VBdG9tQnVpbGRGaWxlKSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oJy5hdG9tLWJ1aWxkLmpzb24nKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICB2YXIgb3V0cHV0ID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50O1xuXG4gICAgICAgIGV4cGVjdChvdXRwdXQuaW5kZXhPZignUFJPSkVDVF9QQVRIPScgKyBkaXJlY3Rvcnkuc3Vic3RyaW5nKDAsIC0xKSkpLm5vdC50b0JlKC0xKTtcbiAgICAgICAgZXhwZWN0KG91dHB1dC5pbmRleE9mKCdGSUxFX0FDVElWRT0nICsgZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nKSkubm90LnRvQmUoLTEpO1xuICAgICAgICBleHBlY3Qob3V0cHV0LmluZGV4T2YoJ0ZST01fRU5WPScgKyBkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicpKS5ub3QudG9CZSgtMSk7XG4gICAgICAgIGV4cGVjdChvdXRwdXQuaW5kZXhPZignRklMRV9BQ1RJVkVfTkFNRT0uYXRvbS1idWlsZC5qc29uJykpLm5vdC50b0JlKC0xKTtcbiAgICAgICAgZXhwZWN0KG91dHB1dC5pbmRleE9mKCdGSUxFX0FDVElWRV9OQU1FX0JBU0U9LmF0b20tYnVpbGQnKSkubm90LnRvQmUoLTEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIG91dHB1dCBmcm9tIGJ1aWxkIGNvbnRhaW5zIEhUTUwgY2hhcmFjdGVycycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgZXNjYXBlIHRob3NlIHByb3Blcmx5IHNvIHRoZSBvdXRwdXQgaXMgbm90IGdhcmJsZWQgb3IgbWlzc2luZycsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGVzY2FwZU1ha2VmaWxlKSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS5pbm5lckhUTUwpLnRvTWF0Y2goLyZsdDtzY3JpcHQgdHlwZT1cInRleHRcXC9qYXZhc2NyaXB0XCImZ3Q7YWxlcnRcXCgnWFNTISdcXCkmbHQ7XFwvc2NyaXB0Jmd0Oy8pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSB0ZXh0IGVkaXRvciBpcyBtb2RpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgc2hvdyB0aGUgc2F2ZSBjb25maXJtYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZC1jb25maXJtJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGdvb2RNYWtlZmlsZSkpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdNYWtlZmlsZScpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdoZWxsbyBrYW5zYXMnKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCc6Zm9jdXMnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnRuLXN1Y2Nlc3M6Zm9jdXMnKSkudG9FeGlzdCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNhbmNlbCB0aGUgY29uZmlybSB3aW5kb3cgd2hlbiBwcmVzc2luZyBlc2NhcGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZC1jb25maXJtJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGdvb2RNYWtlZmlsZSkpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdNYWtlZmlsZScpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdoZWxsbyBrYW5zYXMnKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCc6Zm9jdXMnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDpuby1jb25maXJtJyk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tc3VjY2Vzczpmb2N1cycpKS5ub3QudG9FeGlzdCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjb25maXJtIGlmIGEgVGV4dEVkaXRvciBlZGl0cyBhbiB1bnNhdmVkIGZpbGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZC1jb25maXJtJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGdvb2RNYWtlZmlsZSkpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdNYWtlZmlsZScpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWRpdG9yID0gXy5maW5kKGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCksIGZ1bmN0aW9uKHRleHRFZGl0b3IpIHtcbiAgICAgICAgICByZXR1cm4gKCd1bnRpdGxlZCcgPT09IHRleHRFZGl0b3IuZ2V0VGl0bGUoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnSnVzdCBzb21lIHRlbXBvcmFyeSBwbGFjZSB0byB3cml0ZSBzdHVmZicpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9TdXJwcmlzaW5nIGlzIHRoZSBwYXNzaW5nIG9mIHRpbWVcXG5idXQgbm90IHNvLCBhcyB0aGUgdGltZSBvZiBwYXNzaW5nLyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2F2ZSBhbmQgYnVpbGQgd2hlbiBzZWxlY3Rpbmcgc2F2ZSBhbmQgYnVpbGQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZC1jb25maXJtJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGdvb2RNYWtlZmlsZSkpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdNYWtlZmlsZScpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdkdW1teTpcXG5cXHRlY2hvIGthbnNhc1xcbicpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJzpmb2N1cycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignOmZvY3VzJykuY2xpY2soKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykuaW5uZXJIVE1MKS50b01hdGNoKC9rYW5zYXMvKTtcbiAgICAgICAgZXhwZWN0KCFlZGl0b3IuaXNNb2RpZmllZCgpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBidWlsZCBidXQgbm90IHNhdmUgd2hlbiBvcHRpbmcgc28nLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZC1jb25maXJtJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGdvb2RNYWtlZmlsZSkpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdNYWtlZmlsZScpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdkdW1teTpcXG5cXHRlY2hvIGthbnNhc1xcbicpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJzpmb2N1cycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uW2NsaWNrPVwiY29uZmlybVdpdGhvdXRTYXZlXCJdJykuY2xpY2soKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykuaW5uZXJIVE1MKS5ub3QudG9NYXRjaCgva2Fuc2FzLyk7XG4gICAgICAgIGV4cGVjdChlZGl0b3IuaXNNb2RpZmllZCgpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBkbyBub3RoaW5nIHdoZW4gY2FuY2VsbGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkLWNvbmZpcm0nKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnTWFrZWZpbGUnLCBmcy5yZWFkRmlsZVN5bmMoZ29vZE1ha2VmaWxlKSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oJ01ha2VmaWxlJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ2R1bW15OlxcblxcdGVjaG8ga2Fuc2FzXFxuJyk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignOmZvY3VzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b25bY2xpY2s9XCJjYW5jZWxcIl0nKS5jbGljaygpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzKDIpO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KGVkaXRvci5pc01vZGlmaWVkKCkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSB0ZXh0IGVkaXRvciBpcyBzYXZlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgYnVpbGQgd2hlbiBidWlsZE9uU2F2ZSBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLmJ1aWxkT25TYXZlJywgdHJ1ZSk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJ01ha2VmaWxlJywgZnMucmVhZEZpbGVTeW5jKGdvb2RNYWtlZmlsZSkpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdkdW1teScpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIGVkaXRvci5zYXZlKCk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAnKSkudG9FeGlzdCgpO1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvU3VycHJpc2luZyBpcyB0aGUgcGFzc2luZyBvZiB0aW1lXFxuYnV0IG5vdCBzbywgYXMgdGhlIHRpbWUgb2YgcGFzc2luZy8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBidWlsZCB3aGVuIGJ1aWxkT25TYXZlIGlzIGZhbHNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLmJ1aWxkT25TYXZlJywgZmFsc2UpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICdNYWtlZmlsZScsIGZzLnJlYWRGaWxlU3luYyhnb29kTWFrZWZpbGUpKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbignZHVtbXknKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgICBlZGl0b3Iuc2F2ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIG91dHB1dCBpcyBjYXB0dXJlZCB0byBzaG93IGVkaXRvciBvbiBlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIHBsYWNlIHRoZSBsaW5lIGFuZCBjb2x1bW4gb24gZXJyb3IgaW4gY29ycmVjdCBmaWxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkLWNvbmZpcm0nKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhlcnJvck1hdGNoQXRvbUJ1aWxkRmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnZXJyb3InKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDplcnJvci1tYXRjaCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIHZhciBidWZmZXJQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpO1xuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRpdGxlKCkpLnRvRXF1YWwoJy5hdG9tLWJ1aWxkLmpzb24nKTtcbiAgICAgICAgZXhwZWN0KGJ1ZmZlclBvc2l0aW9uLnJvdykudG9FcXVhbCgyKTtcbiAgICAgICAgZXhwZWN0KGJ1ZmZlclBvc2l0aW9uLmNvbHVtbikudG9FcXVhbCg3KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIGp1c3QgdGhlIGZpbGUgaWYgbGluZSBhbmQgY29sdW1uIGlzIG5vdCBhdmFpbGFibGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQtY29uZmlybScpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgZnMucmVhZEZpbGVTeW5jKGVycm9yTWF0Y2hOTENBdG9tQnVpbGRGaWxlKSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdlcnJvcicpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOmVycm9yLW1hdGNoJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUaXRsZSgpKS50b0VxdWFsKCcuYXRvbS1idWlsZC5qc29uJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==