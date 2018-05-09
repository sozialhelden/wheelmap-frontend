module.exports = function(context) {
    var util = require('util'),
    	fs = require('fs'),
        path = require('path'),
        xml2js = require('xml2js');

    var platforms = context.opts.platforms,
        cliCommand = context.cmdLine,
        fileName = 'config.xml',
        filePath = path.normalize(path.join(context.opts.projectRoot, fileName)),
        parser = new xml2js.Parser(),
        changeVersion,
        platformName,
        needRewrite = false,
        finishMessage = [];
    // hook configuration
    var increment = !(cliCommand.indexOf('--no-inc') > -1),
        platformVersion = !(cliCommand.indexOf('--no-platform-inc') > -1),
        incrementVersion = (cliCommand.indexOf('--inc-version') > -1);

    if(!increment) {
        console.log('--no-inc flag detected. No build increment executed.');
        return;
    }

    fs.readFile(filePath, { encoding:'utf8' }, function(err, data) {
        if(err) throw err;
        parser.parseString(data, function (err, result) {
            if(err) throw err;

            parseConfig(result);
        });
    });

    function parseConfig(configOpts) {
        if (platformVersion) {
            platforms.forEach(function (platform) {
                if(setPlatformInfo(platform))
                    configOpts = handleResult(configOpts);
            });
        } 
        if (incrementVersion) {
            changeVersion = 'version';
            platformName = 'App';
            configOpts = handleResult(configOpts);
        }

        if(needRewrite) {
            rewriteConfig(configOpts);
        } else {
            console.log(fileName + ' build numbers not changed');
        }
    }

    function rewriteConfig(result) {
        fs.writeFile(filePath, buildXML(result), { encoding:'utf8' }, function(err) {
            if(err) throw err;
            finishMessage.push('Saved in ' + fileName);
            finishMessage.forEach( function(line) { console.log(line); } );
        });
    }

    function setPlatformInfo(platform) {
        switch (platform) {
            case 'android':
                changeVersion = 'android-versionCode';
                platformName = 'Android';
                break;
            case 'ios':
                changeVersion = 'ios-CFBundleVersion';
                platformName = 'iOS';
                break;
            case 'osx':
                changeVersion = 'osx-CFBundleVersion';
                platformName = 'OS X';
                break;
            case 'windows':
                changeVersion = 'windows-packageVersion';
                platformName = 'Windows';
                break;
            default:
                console.log('This hook supports Android, iOS, OS X, and Windows currently, ' + platform + ' not supported');
                return false;
        }
        return true;
    }

    function handleResult(result) {
        var newVersion =  null;
        if(result.widget.$[changeVersion]) { 
            newVersion = processVersionCode(result.widget.$[changeVersion]);
            if (newVersion) result.widget.$[changeVersion] = newVersion;
            else finishMessage.push(platformName + ' version code still "' + result.widget.$[changeVersion] + '"');
        } else {
            finishMessage.push(platformName + ' version code not found');
        }
        if(newVersion) {
            needRewrite = true;
            finishMessage.push(platformName + ' build number incremented to "' + newVersion + '"');
        }
        return result;
    }

    function buildXML(obj) {
        var builder = new xml2js.Builder();
        builder.options.renderOpts.indent = '\t';
        var x = builder.buildObject(obj);
        return x.toString();
    }

    function processVersionCode(code) {
        if (!code) return null;
        var newCode = code.replace(/[0-9]+$/, newVersion);
        if (newCode == code) return null; //Version not changed, no match
        return newCode;
    }

    function newVersion(match, offset, original) {
        if(!match) return null;
        try {
            var l = match.length;
            match = parseInt(match) + 1;
            return pad(match, l);
        } catch (e) {
            return null;
        }
    }

    function pad(code, origLen) {
        code = code.toString();
        if (code.length >= origLen) return code;
        while(code.length < origLen) {
            code = '0' + code;
        }
        return code;
    }
}