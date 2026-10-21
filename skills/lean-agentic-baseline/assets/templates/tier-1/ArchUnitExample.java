@ArchTest
static final ArchRule routesDoNotTouchRepos =
    noClasses().that().resideInAPackage("..routes..")
        .should().dependOnClassesThat().resideInAPackage("..repos..");
