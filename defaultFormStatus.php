<?php

namespace UWMadison\defaultFormStatus;
use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;
use REDcap;

class defaultFormStatus extends AbstractExternalModule {
    
    private $module_global = 'defaultFormStatus';
    private $default_settings = ["note"=>"","select"=>"","hide"=>false,"save"=>false];
    
    /*
    Redcap hook to load for the Designer page (where we config the EM) and 
    for the config page to cleanup the EM's menu
    */
    public function redcap_every_page_top($project_id) {
        
        // Designer Page
        if (strpos(PAGE, 'Design/online_designer.php') !== false && $project_id != NULL && $_GET['page']) {
            $this->initGlobal();
            $json = $this->loadJSON($_GET['page']);
            $json = empty($json) ? $this->default_settings : $json; // Load Default
            $this->passArgument('config',$json);
            $this->includeJs('designer.js');
        }
        
        // Custom Config page
        if (strpos(PAGE, 'manager/project.php') !== false && $project_id != NULL) {
            $this->initGlobal();
            $this->includeJs('config.js');
        }
    }
    
    /*
    Redcap hook to load any configured EM settings on the data entry form
    */
    public function redcap_data_entry_form($project_id, $record, $instrument, $event_id) {

        // Load JSON, if no settings then skip
        $json = $this->loadJSON($instrument);
        if ( empty($json) )
            return;

        // Check if this is the first load for the save-on-first-load feature
        $data = REDCap::getData($project_id,'array',$record,$instrument.'_complete',$event_id);
        if ( count($data) != 1 || $data[$record][$event_id][$instrument.'_complete'] == '0' )
            $json['firstLoad'] = true;

        // Pass down and load js       
        $this->initGlobal(); 
        $this->passArgument('config',$json);
        $this->includeJs('dataentry.js');
    }
    
    /*
    Load and parse the one EM setting from its JSON
    */
    private function loadJSON($instrument) {
        $json = $this->getProjectSetting('json');
        $json = empty($json) ? null : (array)json_decode($json)->$instrument;
        return $json;
    }

    /*
    Save the current instrument's new dfs settings. Invoked via ajax/router
    */
    public function saveSettings() {
        $config = (array) json_decode($_POST['config']);
        $form = $_POST['instrument'];
    
        $json = ExternalModules::getProjectSetting($this->PREFIX, $_GET['pid'], 'json');
        $json = !empty($json) ? (array)json_decode($json) : [];
        $json[$form] = $config;
        ExternalModules::setProjectSetting($this->PREFIX, $_GET['pid'], 'json', json_encode($json));
        echo "Saved Default Form Status Settings";
    }
    
    /*
    Init the dfs global and load in any easy-to-gather settings
    */
    private function initGlobal() {
        $data = json_encode([
            "modulePrefix" => $this->PREFIX,
            "router" => $this->getUrl('router.php')
        ]);
        echo "<script>var {$this->module_global} = {$data};</script>";
    }

    /*
    HTML to pass down a new setting to the module global after init
    */
    private function passArgument($name, $value) {
        echo "<script>{$this->module_global}.{$name} = ".json_encode($value).";</script>";
    }
    
    /*
    HTML to include local JS file
    */
    private function includeJs($path) {
        echo "<script src={$this->getUrl($path)}></script>";
    }
}

?>
