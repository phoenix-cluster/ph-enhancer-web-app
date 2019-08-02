// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseUrl : 'http://namenode:8070/v1/',
  // analysisBaseUrl : 'http://namenode:8090/example/v1/',
  analysisBaseUrl : 'http://namenode:5001/',
  //clusterBaseUrl : 'http://enhancer.ncpsb.org:8090/v1/',
  clusterBaseUrl : 'http://namenode:8070/v1/',
  defaultProject : 'PXD000021',
  defaultMinClusterSize : 10,
  allowedFileType : [
        'xml','xml.gz',
        'mzid','mzid.gz',
        'mgf','mgf.gz',
        'MGF','MGF.gz',
        'mzML'
    ]
};
