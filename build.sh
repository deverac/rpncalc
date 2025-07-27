#!/bin/sh
set -e

if [ "$1" = "" ] || [ "$1" = "help" ]; then
    echo "$0 [ help | rpncalc | debug | release | tests | watch | clean | reallyclean ]"
    echo "   help         Show this help"
    echo "   rpncalc      Build rpncalc.html"
    echo "   debug        Build debug APK"
    echo "   release      Build release APK (with auto-generated signing key)"
    echo "   tests        Create rpncalc-tests.html"
    echo "   watch        Regenerate rpncalc-tests.html if sources are modified"
    echo "   clean        Remove Android ./app/build directory"
    echo "   reallyclean  Same as 'clean' and also remove other generated files"
    echo
    echo "Load rpncalc-tests.html in a browser to run tests. Test output will"
    echo "appear in the console."
    exit
fi

BLD_DIR=bld

PROJ_DIR=./AndroidRpnCalc
SRC_CALC=./src/rpncalc.html
BLD_CALC=./$BLD_DIR/rpncalc.html


############ Clean ############
if [ "$1" = "clean" ]; then
    rm -rf $PROJ_DIR/app/build
    rm -rf $BLD_DIR
    exit
fi

############ Really clean ############
if [ "$1" = "reallyclean" ]; then
    $0 clean
    rm -rf $PROJ_DIR/.gradle
    rm -rf $PROJ_DIR/.idea
    rm -rf $PROJ_DIR/.kotlin
    rm -f $PROJ_DIR/app/src/main/res/mipmap-hdpi/ic_launcher.png
    rm -f $PROJ_DIR/app/src/main/res/mipmap-mdpi/ic_launcher.png
    rm -f $PROJ_DIR/app/src/main/res/mipmap-xhdpi/ic_launcher.png
    rm -f $PROJ_DIR/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
    rm -f $PROJ_DIR/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
    exit
fi

build_rpncalc() {
    mkdir -p $BLD_DIR
    cp $SRC_CALC $BLD_CALC
}


############ Build RpnCalc ############ 
if [ "$1" = "rpncalc" ]; then
    build_rpncalc
    exit
fi


if [ "$1" = "release" ] || [ "$1" = "debug" ]; then

    # Only auto-build if it does not exist, because we may want to use a
    # custom rpncalc.html file.
    if [ ! -e $BLD_CALC ]; then
        build_rpncalc
    fi

    cp -f $BLD_CALC $PROJ_DIR/app/src/main/assets/

    # Generate app icons.
    # If file exists, assume it exists for all resolutions, otherwise generate.
    RES_DIR=$PROJ_DIR/app/src/main/res/
    if [ ! -e $RES_DIR/mipmap-hdpi/ic_launcher.png ]; then
        SRC=./src/calc_sq.png
        convert $SRC  -resize 48x48    $RES_DIR/mipmap-mdpi/ic_launcher.png
        convert $SRC  -resize 72x72    $RES_DIR/mipmap-hdpi/ic_launcher.png
        convert $SRC  -resize 96x96    $RES_DIR/mipmap-xhdpi/ic_launcher.png
        convert $SRC  -resize 144x144  $RES_DIR/mipmap-xxhdpi/ic_launcher.png
        convert $SRC  -resize 192x192  $RES_DIR/mipmap-xxxhdpi/ic_launcher.png
    fi
fi



############ Build debug APK ############
if [ "$1" = "debug" ]; then
    APK=$PROJ_DIR/app/build/outputs/apk/debug/app-debug.apk
    APP_DBG=./$BLD_DIR/app-debug.apk

    cd $PROJ_DIR
        # Build debug Android APK
        ./gradlew assembleDebug
    cd ..
    cp $APK $APP_DBG
    echo "===> Created $APP_DBG"
    ls -l $APP_DBG
    exit
fi


############ Build release APK ############
if [ "$1" = "release" ]; then

    cd $PROJ_DIR

        # Build Android APK
        ./gradlew assembleRelease


        PASSWORD=topsecret  # Must be six chars minimum.
        DAYS=20000          # 20,000 days is over 54 years
        KEYSTORE=../$BLD_DIR/mykeystore
        APP_UNS=./app/build/outputs/apk/release/app-release-unsigned.apk
        APP_ALI=../$BLD_DIR/app-unsigned-aligned.apk
        APP_REL=../$BLD_DIR/app-release.apk
        TOOLS_DIR=../../android/sdk/build-tools/36.0.0

        if [ ! -e $TOOLS_DIR/apksigner ]; then
            echo "'apksigner' not found. Update TOOLS_DIR in $0"
            echo "to the directory containing 'apksigner'."
            exit 1
        fi

        rm -f $KEYSTORE
        rm -f $APP_ALI
        rm -f $APP_REL

        echo "===> Creating keystore"
        echo "$PASSWORD\n$PASSWORD\nNobody\n\n\nChicago\nIL\nUS\nyes" | keytool -genkey -v -keystore "$KEYSTORE" -keyalg RSA -keysize 2048 -validity "$DAYS" -alias my-alias

        echo "===> Aligning APK"
        zipalign -v -p 4 "$APP_UNS" "$APP_ALI"

        # Sign app
        # 'jarsigner' should not be used. It signs using v1 which is no longer allowed.
        echo "===> Signing APK"
        echo "$PASSWORD" | $TOOLS_DIR/apksigner sign --ks "$KEYSTORE" --out "$APP_REL" "$APP_ALI"

        # Verify app
        # If '--min-sdk-version 24' is not used, app will also be verified with v1 signing which will
        # produce a lot of 'WARNING: META-INF/.../file.txt not protected by signature.' These warnings are noisy, but not critical.
        echo "===> Verifying APK"
        $TOOLS_DIR/apksigner verify --min-sdk-version 24 "$APP_REL"
        
        rm -f $APP_ALI
    cd ..
    ABS_DIR=$(readlink -f "$PROJ_DIR/$APP_REL")
    CUR_DIR=$(pwd)
    echo "===> Created .${ABS_DIR#$CUR_DIR}"
    ls -l .${ABS_DIR#$CUR_DIR}
    exit
fi



############ Build tests ############
if [ "$1" = "tests" ]; then
    TST_JS=./src/tests.js
    BLD_HTML=./$BLD_DIR/rpncalc.html
    TST_HTML=./$BLD_DIR/rpncalc-tests.html

    # Only auto-build if it does not exist, because we may want to use a
    # custom rpncalc.html file.
    if [ ! -e $BLD_CALC ]; then
        build_rpncalc
    fi

    # 'Inject' tests into HTML file. The tests will be automatically run
    # when the HTML file is loaded into a browser.
    (
        sed -e '/########## TESTS_PLACEHOLDER ##########/,$d' $BLD_HTML
        cat $TST_JS
        sed -e '1,/########## TESTS_PLACEHOLDER ##########/d' $BLD_HTML
    ) > $TST_HTML
    exit
fi


############ Watch files for changes ############
if [ "$1" = "watch" ]; then
    echo "Watching files"
    echo "Press ^C to quit"
    W_FILES="./src/rpncalc.html ./src/tests.js"
    W_TS_PREV=""
    while true; do
        W_TS_CUR=""

        # Record last-modified timestamp of each file.
        for nm in $W_FILES; do
            W_TS_CUR=`stat -c %Y $nm`",$W_TS_CUR"
        done

        # If timestamps do not match, regenerate.
        if [ "$W_TS_CUR" != "$W_TS_PREV" ]; then
            echo "============ Building at "`date`
            $0 calc # Re-build rpncalc.html
            $0 tests # Re-add tests.
            W_TS_PREV=$W_TS_CUR
        fi

        sleep 1
    done
fi
