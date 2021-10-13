# Default From Status - Redcap External Module

## What does it do?

DFS allows you to set a default form status (complete, incomplete, unverified), auto-save an instrument when it is first opened, hide the form status from the end-user to prevent editing, and leave notes at the end of the form for any reason. 

![](https://i.imgur.com/WthuOQn.png)

## Installing

This EM isn't yet available to install via redcap's EM database so you'll need to install to your modules folder (i.e. `redcap/modules/default_form_status_v1.0.0`) manually.

## Configuration

The module has no configuration and instead, once enabled on a project, appends an additional "Form Status" section to the end of every form designer. Simply use the designer to edit the Default Form Status as you please. The JSON saved for this configuration can be viewed in the the EM configuration if you'd like to bulk add or modify the settings. 
