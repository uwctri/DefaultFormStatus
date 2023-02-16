<?php

namespace UWMadison\defaultFormStatus;

use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;
use REDcap;

class defaultFormStatus extends AbstractExternalModule
{
    private $default_settings = ["note" => "", "select" => "", "hide" => false, "save" => false];

    /*
    Redcap hook to load for the Designer page (where we config the EM) and 
    for the config page to cleanup the EM's menu
    */
    public function redcap_every_page_top($project_id)
    {
        // Designer Page
        if ($this->isPage('Design/online_designer.php') && $project_id != NULL && $_GET['page']) {
            $json = $this->loadJSON($_GET['page'], true);
            $this->loadSettings(["settings" => $json]);
            $this->includeJs('designer.js');
        }

        // Custom Config page
        if ($this->isPage('ExternalModules/manager/project.php') && $project_id != NULL) {
            $this->loadSettings();
            $this->includeJs('config.js');
        }
    }

    /*
    Redcap hook to load any configured EM settings on the data entry form
    */
    public function redcap_data_entry_form($project_id, $record, $instrument, $event_id)
    {
        // Load JSON, if no settings then skip
        $json = $this->loadJSON($instrument);
        if (empty($json)) return;

        // Check if this is the first load for the save-on-first-load feature
        $data = REDCap::getData($project_id, 'array', $record, $instrument . '_complete', $event_id);
        if (count($data) != 1 || $data[$record][$event_id][$instrument . '_complete'] == '0')
            $json['firstLoad'] = true;

        // Pass down and load js       
        $this->loadSettings(["settings" => $json]);
        $this->includeJs('dataentry.js');
    }

    /*
    Handle write backs from data entry page
    */
    public function redcap_module_ajax($action, $payload, $project_id, $record, $instrument)
    {
        $result = false;
        if ($action == "save" && !empty($instrument)) {
            $json = ExternalModules::getProjectSetting($this->PREFIX, $project_id, 'json');
            $json = !empty($json) ? json_decode($json, true) : [];
            $json[$instrument] = $payload;
            ExternalModules::setProjectSetting($this->PREFIX, $project_id, 'json', json_encode($json));
            $result = true;
        }
        return ["success" =>  $result];
    }

    /*
    Load and parse the one EM setting from its JSON
    */
    private function loadJSON($instrument, $giveDefault = false)
    {
        $json = $this->getProjectSetting('json');
        return empty($json) ? ($giveDefault ? $this->default_settings : []) : (array)json_decode($json)->$instrument;
    }

    /*
    Init the dfs global and load in any easy-to-gather settings
    */
    private function loadSettings($settings = [])
    {
        $this->initializeJavascriptModuleObject();
        $settings["prefix"] = $this->PREFIX;
        $settings = json_encode($settings);
        echo "<script>Object.assign({$this->getJavascriptModuleObjectName()}, {$settings});</script>";
    }

    /*
    HTML to include local JS file
    */
    private function includeJs($path)
    {
        echo "<script src={$this->getUrl($path)}></script>";
    }
}
